<div align="center">
  <br />
  <h1>🏢 LIFT — The Building Remembers</h1>
  <p>
    <strong>A premium, cinematic WebGL art installation exploring memory, isolation, and ambition.</strong>
  </p>
  <p>
    <i>Built for the DJXHack Residency 2026 — Theme: "Everyday Magic"</i>
  </p>
  <br />
</div>

---

## 📽 The Vision

Every day in India, millions of people step into elevators. For sixty seconds, they are suspended in a liminal space between where they came from and where they are going. **LIFT** is a browser-first, interactive 3D narrative experience that transforms this mundane daily ritual into an emotional exploration of unseen lives.

Instead of a typical web application, **LIFT** operates as a restrained, cinematic art installation. You select Floor 7. The mechanical hum vibrates. The numbers tick upward. And when the doors open, you do not step into a hallway—you step into a memory.

## ✨ Features & Everyday Magic

* **Cinematic Restraint**: No frantic video-game controls. The camera uses a custom-built, restrained "mouse-look" choreography that glides seamlessly to objects of interest, mimicking the cinematography of an A24 indie film.
* **Emotional Storytelling**: 
  * A scattered laptop whispering of an *Interview Tomorrow*.
  * A coffee cup, *Still warm. No one has taken a sip in twenty minutes.*
  * A brass Ganesha idol, *Watching over from 2,000 kilometers away.*
* **Atmospheric Polish**: 
  * Highly tuned Post-Processing: Heavy **Bloom**, deep **Vignettes**, and gorgeous **Depth of Field** blurring.
  * Dynamic, moving shadows cast by a slowly spinning ceiling fan. 
* **Premium Typography**: Integration of *Playfair Display* and *Inter* for breathtaking title cards and UI overlays.

## 🛠 Tech Stack

Built entirely for the modern browser, requiring no downloads or plugins:
- **Core**: React 18 & TypeScript
- **Renderer**: Three.js & `@react-three/fiber`
- **Helpers & Post-Processing**: `@react-three/drei`, `@react-three/postprocessing`
- **State Management**: `zustand` (For phase transitions & narrative flags)
- **Tooling & Build**: Vite (For lightning-fast HMR and optimized production bundles)

## 🏆 Why This Fits DJXHack Residency 2026

The residency asks for **"Everyday Magic."** Most developers look at this prompt and build AR tools or generic utility apps. **LIFT** answers the prompt by finding the profound magic in the most overlooked, everyday mechanism: an elevator. It proves that web development is not just about moving data—it is a deeply capable medium for high-end, emotional, immersive storytelling. 

---

## 💻 Run Locally

Want to experience the art installation on your own machine?

```bash
# 1. Clone the repository
git clone https://github.com/your-username/lift.git

# 2. Navigate into the directory
cd lift

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

## 🚀 Deployment
This project is fully static and optimized for immediate deployment. 
To build the production bundle, simply run:
```bash
npm run build
```
The resulting `dist` folder can be dragged directly into **Netlify**, or deployed seamlessly via **Vercel** or **GitHub Pages**.

---

<div align="center">
  <p>Designed and Developed with 🤍 for DJXHack 2026.</p>
</div>
