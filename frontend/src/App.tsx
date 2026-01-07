import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Skills } from './components/sections/Skills';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';

function App() {
  return (
    <div className="min-h-screen bg-bg-app text-text-primary font-sans antialiased transition-colors duration-300">
      <Navbar />

      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

export default App;
