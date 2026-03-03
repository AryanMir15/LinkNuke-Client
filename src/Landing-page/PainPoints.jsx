import React, { useState } from "react";
import {
  AlertTriangle,
  Check,
  Shield,
  Zap,
  Eye,
  Clock,
  Lock,
} from "lucide-react";

const painPoints = [
  {
    icon: "AlertTriangle",
    text: "Links stay live forever even when they're not supposed to.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    icon: "Eye",
    text: "Previews can leak sensitive info before someone even clicks.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    icon: "Zap",
    text: "You can't control where that link ends up once it's out.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    icon: "Clock",
    text: "There's no way to set a proper expiry or time bomb.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    icon: "Shield",
    text: "You end up relying on trust when you should rely on tech.",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
];

const solutions = [
  {
    icon: "Check",
    text: "LinkNuke nukes your link after one view or a timer you set. Your rules.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: "Eye",
    text: "Everything stays hidden until opened. No previews, no leaks.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: "Lock",
    text: "You can lock links with view limits and time-based nukes.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: "Clock",
    text: "Set it, forget it. Link gone exactly when you said.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: "Shield",
    text: "You're in full control. No guessing. No false hope.",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
];

function PainPoints() {
  const [activeTab, setActiveTab] = useState("problems");

  const renderIcon = (iconName) => {
    const iconMap = {
      AlertTriangle: <AlertTriangle className="h-5 w-5" />,
      Eye: <Eye className="h-5 w-5" />,
      Zap: <Zap className="h-5 w-5" />,
      Clock: <Clock className="h-5 w-5" />,
      Shield: <Shield className="h-5 w-5" />,
      Check: <Check className="h-5 w-5" />,
      Lock: <Lock className="h-5 w-5" />,
    };
    return iconMap[iconName] || null;
  };

  return (
    <section
      className="relative w-full bg-black py-24 sm:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden"
      id="pain-points"
    >
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(29, 228, 191, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29, 228, 191, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${60}px ${60}px`,
        }}
      />

      {/* Subtle Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
      <div className="relative max-w-6xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
            <AlertTriangle className="h-4 w-4 mr-2" />
            The Problem
          </div>

          <h2 className="font-medium text-[48px] sm:text-[56px] lg:text-[72px] leading-tight tracking-tight text-white mb-6">
            Why risky links put your
            <span className="bg-gradient-to-r from-red-400 to-red-600 text-transparent bg-clip-text">
              {" "}
              info in danger
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-thin">
            Here's what's wrong and how LinkNuke fixes it.
          </p>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex sm:hidden mb-10">
          <button
            onClick={() => setActiveTab("problems")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-l-lg border transition-all duration-300 ${
              activeTab === "problems"
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-gray-800/50 border-gray-700 text-gray-400"
            }`}
          >
            Problems
          </button>
          <button
            onClick={() => setActiveTab("solutions")}
            className={`flex-1 py-3 px-4 text-sm font-medium rounded-r-lg border border-l-0 transition-all duration-300 ${
              activeTab === "solutions"
                ? "bg-green-500/20 border-green-500/40 text-green-400"
                : "bg-gray-800/50 border-gray-700 text-gray-400"
            }`}
          >
            Solutions
          </button>
        </div>

        {/* Desktop Side-by-Side Layout */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-8 lg:gap-12">
          {/* Problems Side */}
          <div>
            <div className="relative bg-gradient-to-br from-red-500/5 to-red-600/5 border border-red-500/20 rounded-2xl p-8 lg:p-10 backdrop-blur-sm">
              {/* Subtle Grid Pattern Overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-[0.03]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${20}px ${20}px`,
                }}
              />
              <div className="relative flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="font-thin text-[24px] text-white">
                  The Problems
                </h3>
              </div>

              <div className="relative space-y-5">
                {painPoints.map((point, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${point.bgColor} ${point.borderColor}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={`mt-0.5 shrink-0 ${point.color}`}>
                      {renderIcon(point.icon)}
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {point.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Solutions Side */}
          <div>
            <div className="relative bg-gradient-to-br from-green-500/5 to-green-600/5 border border-green-500/20 rounded-2xl p-8 lg:p-10 backdrop-blur-sm">
              {/* Subtle Grid Pattern Overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-[0.03]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${20}px ${20}px`,
                }}
              />
              <div className="relative flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  {renderIcon("Check")}
                </div>
                <h3 className="font-thin text-[24px] text-white">
                  The Solutions
                </h3>
              </div>

              <div className="relative space-y-5">
                {solutions.map((solution, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${solution.bgColor} ${solution.borderColor}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={`mt-0.5 shrink-0 ${solution.color}`}>
                      {renderIcon(solution.icon)}
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {solution.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Single Column Layout */}
        <div className="sm:hidden">
          {activeTab === "problems" && (
            <div>
              <div className="relative bg-gradient-to-br from-red-500/5 to-red-600/5 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
                {/* Subtle Grid Pattern Overlay */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-[0.03]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: `${20}px ${20}px`,
                  }}
                />
                <div className="relative flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    {renderIcon("AlertTriangle")}
                  </div>
                  <h3 className="font-thin text-[24px] text-white">
                    The Problems
                  </h3>
                </div>

                <div className="relative space-y-4">
                  {painPoints.map((point, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${point.bgColor} ${point.borderColor}`}
                    >
                      <div className={`mt-0.5 shrink-0 ${point.color}`}>
                        {point.icon}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {point.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "solutions" && (
            <div>
              <div className="relative bg-gradient-to-br from-green-500/5 to-green-600/5 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm">
                {/* Subtle Grid Pattern Overlay */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-[0.03]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: `${20}px ${20}px`,
                  }}
                />
                <div className="relative flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    {renderIcon("Check")}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    The Solutions
                  </h3>
                </div>

                <div className="relative space-y-4">
                  {solutions.map((solution, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${solution.bgColor} ${solution.borderColor}`}
                    >
                      <div className={`mt-0.5 shrink-0 ${solution.color}`}>
                        {solution.icon}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {solution.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-400 text-sm font-medium">
            <Shield className="h-4 w-4 mr-2" />
            Secure by Design
          </div>
        </div>
      </div>
    </section>
  );
}

export default PainPoints;
