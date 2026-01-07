import React from "react";
import { Database, Layout, Cloud, Award } from "lucide-react";

const skillCategories = [
  {
    title: "Backend",
    icon: Database,
    skills: ["Java", "Spring Boot", "Python", "FastAPI", "AI Integration"],
  },
  {
    title: "Frontend",
    icon: Layout,
    skills: ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "DevOps",
    icon: Cloud,
    skills: ["AWS", "Azure", "Linux", "Docker", "CI/CD Pipelines"],
  },
];

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-bg-card transition-colors duration-300">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-sans font-bold text-center mb-12">
          <span className="text-text-primary">
            Technical
          </span>{" "}
          <span className="text-coral-500">Skills</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="flex flex-col p-6 rounded-2xl bg-bg-app border border-border-primary shadow-md-2"
              >
                {/* Icon and Title Section */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 bg-gradient-to-br from-coral-400 to-coral-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md-2">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary leading-tight">
                    {category.title}
                  </h3>
                </div>

                {/* Skills Section */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-bg-card text-text-secondary text-sm font-medium rounded-lg border border-border-primary inline-flex items-center gap-1.5 shadow-sm"
                    >
                      {skill}
                      {(skill === "AWS" || skill === "Azure") && (
                        <Award className="w-4 h-4 text-coral-500" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>

  );
};
