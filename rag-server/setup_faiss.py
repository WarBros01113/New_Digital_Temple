import os
import sys
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings

# Religion configurations
RELIGION_CONFIG = {
    'hinduism': {
        'file': '../religious_books/hinduism.txt',
        'index': 'faiss_index_hinduism'
    },
    'christianity': {
        'file': '../religious_books/chritsian.txt',
        'index': 'faiss_index_christianity'
    },
    'islam': {
        'file': '../religious_books/muslim.txt',
        'index': 'faiss_index_islam'
    },
    'buddhism': {
        'file': '../religious_books/buddhism.txt',
        'index': 'faiss_index_buddhism'
    }
}

def setup_faiss_for_religion(religion, config):
    """Setup FAISS index for a specific religion"""
    print(f"\n🔄 Setting up FAISS index for {religion.capitalize()}...")
    
    # Check if text file exists
    if not os.path.exists(config['file']):
        print(f"❌ Text file not found: {config['file']}")
        return False
    
    try:
        # Read the religious text
        with open(config['file'], "r", encoding="utf-8") as file:
            raw_text = file.read()
        
        if not raw_text.strip():
            print(f"❌ Text file is empty: {config['file']}")
            return False
        
        print(f"📖 Loaded {len(raw_text)} characters from {config['file']}")
        
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500, 
            chunk_overlap=50
        )
        texts = text_splitter.split_text(raw_text)
        print(f"📝 Created {len(texts)} text chunks")
        
        # Create embeddings
        print("🧠 Creating embeddings...")
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Create and save FAISS index
        print("💾 Creating FAISS index...")
        vectorstore = FAISS.from_texts(texts, embeddings)
        vectorstore.save_local(config['index'])
        
        print(f"✅ FAISS index saved to {config['index']}")
        return True
        
    except Exception as e:
        print(f"❌ Error setting up {religion}: {e}")
        return False

def main():
    print("🏛️ Digital Temple FAISS Setup")
    print("=" * 50)
    
    success_count = 0
    total_count = len(RELIGION_CONFIG)
    
    for religion, config in RELIGION_CONFIG.items():
        if setup_faiss_for_religion(religion, config):
            success_count += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Setup Complete: {success_count}/{total_count} religions configured")
    
    if success_count == total_count:
        print("🎉 All FAISS indices created successfully!")
    else:
        print("⚠️  Some indices failed to create. Check the religious text files.")
        
    print("\n📚 Make sure you have the following files in religious_books/:")
    for religion, config in RELIGION_CONFIG.items():
        status = "✅" if os.path.exists(config['file']) else "❌"
        print(f"  {status} {config['file']}")

if __name__ == "__main__":
    main()