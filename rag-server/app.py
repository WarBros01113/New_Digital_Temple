from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Religion configurations
RELIGION_CONFIG = {
    'hinduism': {
        'file': '../religious_books/hinduism.txt',
        'index': 'faiss_index_hinduism',
        'prompt': 'Answer as a wise Hindu sage based on the Bhagavad Gita and Vedic teachings. Provide guidance in 7-8 lines with easy sentences.'
    },
    'christianity': {
        'file': '../religious_books/chritsian.txt',
        'index': 'faiss_index_christianity', 
        'prompt': 'Answer as a wise Christian sage based on the Bible. Provide guidance in 7-8 lines with easy sentences.'
    },
    'islam': {
        'file': '../religious_books/muslim.txt',
        'index': 'faiss_index_islam',
        'prompt': 'Answer as a wise Islamic scholar based on the Quran. Provide guidance in 7-8 lines with easy sentences.'
    },
    'buddhism': {
        'file': '../religious_books/buddhism.txt',
        'index': 'faiss_index_buddhism',
        'prompt': 'Answer as a wise Buddhist monk based on the Dhammapada and Buddha\'s teachings. Provide guidance in 7-8 lines with easy sentences.'
    }
}

# Store retrievers for each religion
retrievers = {}

def setup_religion_retriever(religion):
    """Setup FAISS retriever for a specific religion"""
    config = RELIGION_CONFIG[religion]
    
    if os.path.exists(config['index']):
        print(f"Loading existing FAISS index for {religion}")
        vectorstore = FAISS.load_local(
            config['index'], 
            HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2"), 
            allow_dangerous_deserialization=True
        )
    else:
        print(f"Creating new FAISS index for {religion}")
        if not os.path.exists(config['file']):
            print(f"Warning: {config['file']} not found!")
            return None
            
        with open(config['file'], "r", encoding="utf-8") as file:
            raw_text = file.read()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        texts = text_splitter.split_text(raw_text)

        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = FAISS.from_texts(texts, embeddings)
        vectorstore.save_local(config['index'])
    
    return vectorstore.as_retriever(search_kwargs={"k": 3})

# Initialize all retrievers
print("🔄 Initializing FAISS retrievers for all religions...")
for religion in RELIGION_CONFIG.keys():
    retrievers[religion] = setup_religion_retriever(religion)
    if retrievers[religion]:
        print(f"✅ {religion.capitalize()} retriever ready")
    else:
        print(f"❌ {religion.capitalize()} retriever failed")

def retrieve_context(question, religion):
    """Retrieve relevant context from religious texts"""
    if religion not in retrievers or retrievers[religion] is None:
        return "No context available"
    
    try:
        docs = retrievers[religion].invoke(question)
        return "\n\n".join([doc.page_content for doc in docs])
    except Exception as e:
        print(f"Error retrieving context for {religion}: {e}")
        return "No context available"

def get_gemini_response(question, context, religion):
    """Generate response using Gemini"""
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        prompt = f"Context from sacred texts: {context}\n\nQuestion: {question}\n\n{RELIGION_CONFIG[religion]['prompt']}"
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating Gemini response: {e}")
        return "I apologize, but I'm unable to provide guidance at this moment. Please try again later."

def extract_verses_from_context(context):
    """Extract verses from the retrieved context"""
    verses = []
    lines = context.split('\n')
    
    for line in lines:
        line = line.strip()
        if line and len(line) > 20:  # Filter out very short lines
            # Try to identify verse references
            if any(keyword in line.lower() for keyword in ['chapter', 'verse', ':', 'book']):
                parts = line.split(':', 1)
                if len(parts) == 2:
                    verses.append({
                        'reference': parts[0].strip(),
                        'verse': parts[1].strip()
                    })
                else:
                    verses.append({
                        'reference': 'Sacred Text',
                        'verse': line
                    })
    
    return verses[:3]  # Return top 3 verses

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    active_religions = [r for r in retrievers.keys() if retrievers[r] is not None]
    return jsonify({
        'status': 'healthy',
        'active_religions': active_religions,
        'total_religions': len(RELIGION_CONFIG)
    })

@app.route('/get_guidance', methods=['POST'])
def get_guidance():
    """Main endpoint for getting spiritual guidance"""
    try:
        data = request.get_json()
        question = data.get('question', '').strip()
        religion = data.get('religion', '').lower()
        
        if not question:
            return jsonify({'error': 'Question is required'}), 400
            
        if religion not in RELIGION_CONFIG:
            return jsonify({'error': 'Invalid religion'}), 400
        
        if retrievers[religion] is None:
            return jsonify({'error': f'Religious texts for {religion} not available'}), 500
        
        # Retrieve context and generate response
        context = retrieve_context(question, religion)
        response = get_gemini_response(question, context, religion)
        verses = extract_verses_from_context(context)
        
        return jsonify({
            'response': response,
            'verses': verses,
            'religion': religion,
            'question': question
        })
        
    except Exception as e:
        print(f"Error in get_guidance: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/search_scriptures', methods=['POST'])
def search_scriptures():
    """Search scriptures endpoint"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        religion = data.get('religion', '').lower()
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
            
        if religion not in RELIGION_CONFIG:
            return jsonify({'error': 'Invalid religion'}), 400
        
        if retrievers[religion] is None:
            return jsonify({'error': f'Religious texts for {religion} not available'}), 500
        
        # Retrieve relevant passages
        context = retrieve_context(query, religion)
        verses = extract_verses_from_context(context)
        
        return jsonify({
            'results': verses,
            'religion': religion,
            'query': query
        })
        
    except Exception as e:
        print(f"Error in search_scriptures: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🏛️ Digital Temple RAG Server Starting...")
    print(f"📚 Configured religions: {list(RELIGION_CONFIG.keys())}")
    app.run(host='0.0.0.0', port=5000, debug=True)