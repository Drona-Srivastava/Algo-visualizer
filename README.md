# 📉 Huffman Encoding Visualizer

An interactive **Huffman Encoding visualizer** built using **React + Vite**, designed to demonstrate the complete compression workflow step-by-step.  
The application visually constructs the Huffman Tree, generates optimal binary codes for each character, and supports **real-time encoding and decoding** of text.

This project focuses on making a **greedy compression algorithm intuitive and transparent** through animations and incremental state updates.

---

## 🚀 Features

- **Step-by-Step Tree Construction**  
  Sequentially merges the two lowest-frequency nodes with clear narration of each step.

- **Animated Tree Visualization**  
  Uses `react-d3-tree` to dynamically render and update the Huffman Tree during construction.

- **Automatic Huffman Code Generation**  
  Generates optimal prefix-free binary codes for each character once the tree is complete.

- **Encoding & Decoding Support**  
  - Encode plain text using the generated Huffman codes  
  - Decode any valid Huffman-encoded binary string using the constructed tree

- **Auto Animation Mode**  
  Tree automatically advances to the next step every **1.5 seconds**.

- **Reset Functionality**  
  Instantly clears the current state and restarts the visualization.

---

## 🛠️ Tech Stack

- **React + Vite** – Component-based UI and fast development environment  
- **react-d3-tree** – Interactive and animated tree visualization  
- **JavaScript (ES6)** – Core Huffman encoding/decoding logic  
- **CSS** – Styling and layout  

---

## 📂 How It Works

1. **Input Text**  
   Enter any string to be compressed.

2. **Frequency Analysis**  
   The application computes character frequencies from the input.

3. **Tree Construction**  
   Nodes with the lowest frequencies are merged iteratively to build the Huffman Tree.

4. **Visualization**  
   Each merge operation is visualized in real time with animated transitions.

5. **Code Generation**  
   Binary Huffman codes are derived from root-to-leaf paths.

6. **Decoding**  
   Enter a binary string to decode it back into the original text using the same tree.

---

## ▶️ Usage

```bash
# Clone the repository
git clone https://github.com/Drona-Srivastava/huffman-visualizer

# Navigate into the project directory
cd huffman-visualizer

# Install dependencies
npm install

# Start the development server
npm run dev
```
## 📷 Screenshots

### 1️⃣ Home Page / Input Screen

![Home Page](screenshots/home.png)

### 2️⃣ Tree Building Animation

https://github.com/user-attachments/assets/79f183bd-6f3f-451e-a1c2-d6246e6a1d0c


### 3️⃣ Generated Tree

![Huffman Tree](screenshots/tree.png)

### 4️⃣ Generated Huffman Codes

![Huffman Codes](screenshots/codes.png)

### 5️⃣ Decoding Example

![Decoding](screenshots/decoding.png)
