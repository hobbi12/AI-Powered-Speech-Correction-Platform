import kd from "../assets/img/kt (1) 2.png";
import bb from "../assets/img/Background.png";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import jj from "../assets/img/service.png";
import uu from "../assets/img/uu.png";
import op from "../assets/img/op.png";
import ic1 from "../assets/img/Icon1.png";
import ic2 from "../assets/img/Icon2.png";
import ic3 from "../assets/img/Icon3.png";
import {
  ArrowRight,
  Play,
  Star,
  Users,
  Award,
  Sparkles,
  Zap,
  Brain,
  Shield,
  Target,
} from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  // const [token,setToken]=useState(null)
  const token=localStorage.getItem("token")
  const navigate=useNavigate()
  const handleStartLearning=()=>{
    if(token===null){
      return navigate('/login')
    }
    navigate('/landing')
  }
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Navbar fixed />
      <div className="h-full flex flex-col relative">
        {/* Cyber Grid Background */}
        <div className="fixed inset-0 bg-gradient-dark cyber-grid opacity-20 z-[-2]"></div>

        {/* Particle Effects */}
        <div className="fixed inset-0 particles z-[-1]"></div>

        {/* Hero Section */}
        <section className="relative pt-28 flex flex-col lg:flex-row items-center justify-between px-4 md:px-20 min-h-[100vh] overflow-hidden">
          {/* Enhanced Background */}
          <div className="absolute inset-0 bg-gradient-dark z-[-3]"></div>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5 z-[-1]"
            style={{ backgroundImage: `url(${bb})` }}
          ></div>

          {/* Futuristic Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-neon-blue rounded-full opacity-30 animate-float neon-glow"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-neon-purple rounded-full opacity-30 animate-float neon-glow"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-neon-green rounded-full opacity-30 animate-float neon-glow"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Cyber Orbs */}
          <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-neon-cyan rounded-full opacity-40 animate-pulse-neon"></div>
          <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-neon-pink rounded-full opacity-40 animate-glow"></div>

          {/* Content */}
          <div
            className={`w-full lg:w-1/2 text-center lg:text-left z-10 ${
              isVisible ? "animate-fade-in-left" : "opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-hologram text-neon-blue px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in-down border border-neon-blue/30 backdrop-blur-md">
              <Sparkles className="w-4 h-4 animate-pulse" />
              AI-Powered Speech Therapy
            </div>

            <h1 className="text-responsive-xl font-bold text-white leading-tight mb-8">
              Transform Your{" "}
              <span className="gradient-text" data-text="Speech">
                Speech
              </span>{" "}
              with
              <br />
              <span className="text-neon-cyan">Advanced AI Technology</span>
            </h1>

            <p className="text-lg text-cyber-300 mb-10 leading-relaxed">
              Experience personalized speech therapy powered by artificial
              intelligence. Our innovative platform analyzes pronunciation,
              fluency, and articulation in real-time, offering tailored feedback
              for children and adults.
            </p>

            {/* Enhanced Stats */}
            <div className="flex flex-wrap gap-8 mb-10">
              <div className="flex items-center gap-3 text-cyber-200 bg-cyber-800/50 px-4 py-2 rounded-xl backdrop-blur-md border border-cyber-700/50">
                <Users className="w-5 h-5 text-neon-blue" />
                <span className="font-semibold text-neon-blue">
                  10,000+
                </span>{" "}
                Users
              </div>
              <div className="flex items-center gap-3 text-cyber-200 bg-cyber-800/50 px-4 py-2 rounded-xl backdrop-blur-md border border-cyber-700/50">
                <Star className="w-5 h-5 text-neon-green" />
                <span className="font-semibold text-neon-green">
                  4.9/5
                </span>{" "}
                Rating
              </div>
              <div className="flex items-center gap-3 text-cyber-200 bg-cyber-800/50 px-4 py-2 rounded-xl backdrop-blur-md border border-cyber-700/50">
                <Award className="w-5 h-5 text-neon-purple" />
                <span className="font-semibold text-neon-purple">95%</span>{" "}
                Success Rate
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <button
                onClick={handleStartLearning}
                // to="/login"
                className="btn-primary inline-flex items-center gap-3 group"
              >
                Start Learning
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button className="btn-outline inline-flex items-center gap-3 group">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Enhanced Hero Image */}
          <div
            className={`hidden lg:flex relative mt-10 lg:mt-0 z-10 w-full lg:w-1/2 justify-center ${
              isVisible ? "animate-fade-in-right" : "opacity-0"
            }`}
          >
            <div className="relative">
              <img
                className="w-[280px] md:w-[340px] h-auto z-20 relative animate-float"
                src={kd}
                alt="AI Speech Therapy"
              />
              <div className="absolute inset-0 bg-gradient-neon rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 font-bold text-sm animate-bounce neon-glow">
                AI
              </div>

              {/* Cyber Frame */}
              <div className="absolute inset-0 border-2 border-neon-blue/30 rounded-full animate-pulse-neon"></div>
              <div className="absolute inset-4 border border-neon-cyan/20 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Futuristic Divider */}
        <div className="relative my-20">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neon-blue/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-6 py-2 bg-cyber-950 text-neon-blue border border-neon-blue/30 rounded-full backdrop-blur-md">
              Our Services
            </span>
          </div>
        </div>

        {/* Enhanced Services Section */}
        <section className="px-4 md:px-20 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold text-white mb-6">
              <span className="gradient-text">Comprehensive</span> Speech
              Therapy Solutions
            </h2>
            <p className="text-lg text-cyber-300 max-w-2xl mx-auto">
              Choose from our range of specialized services designed to meet
              your unique needs with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ic1,
                title: "Concierge Therapy",
                desc: "Personalized therapy sessions in your home, our facility, or via secure video calls. Choose what works best for you and your schedule.",
                img: op,
                color: "neon-blue",
                neonColor: "blue",
              },
              {
                icon: ic2,
                title: "Convenient Speech Therapy",
                desc: "Access professional speech therapy services whenever and wherever you need them. Our flexible scheduling adapts to your lifestyle.",
                img: jj,
                color: "neon-purple",
                neonColor: "purple",
              },
              {
                icon: ic3,
                title: "Summer Session",
                desc: "Intensive summer programs designed to address speech delays and developmental communication patterns in a supportive environment.",
                img: uu,
                color: "neon-green",
                neonColor: "green",
              },
            ].map(({ icon, title, desc, img, color, neonColor }, i) => (
              <div
                key={i}
                className={`card-gradient p-8 hover-scale ${
                  isVisible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div
                    className={`p-4 rounded-xl bg-${color}/10 border border-${color}/30 backdrop-blur-md`}
                  >
                    <img className="w-8 h-8" src={icon} alt="icon" />
                  </div>
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-neon flex items-center justify-center text-cyber-950 font-bold text-sm neon-glow`}
                  >
                    {i + 1}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
                <p className="text-cyber-300 mb-8 leading-relaxed">{desc}</p>

                <div className="flex justify-between items-center">
                  <img
                    className="w-20 h-20 object-cover rounded-lg shadow-neon-blue"
                    src={img}
                    alt="illustration"
                  />
                  <div
                    className={`w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 hover-scale cursor-pointer neon-glow`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="px-4 md:px-20 mb-20">
          <div className="bg-gradient-hologram rounded-3xl p-8 md:p-12 border border-neon-blue/20 backdrop-blur-md">
            <div className="text-center mb-16">
              <h2 className="text-responsive-lg font-bold text-white mb-6">
                Why Choose Our <span className="gradient-text">AI-Powered</span>{" "}
                Platform?
              </h2>
              <p className="text-lg text-cyber-300 max-w-2xl mx-auto">
                Experience the future of speech therapy with cutting-edge
                technology and advanced AI algorithms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Target,
                  title: "Personalized",
                  desc: "AI adapts to your progress",
                  color: "neon-blue",
                },
                {
                  icon: Zap,
                  title: "Real-time",
                  desc: "Instant feedback and analysis",
                  color: "neon-green",
                },
                {
                  icon: Shield,
                  title: "Secure",
                  desc: "Advanced encryption & privacy",
                  color: "neon-purple",
                },
                {
                  icon: Brain,
                  title: "Intelligent",
                  desc: "Neural network powered",
                  color: "neon-cyan",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="text-center p-8 bg-cyber-800/30 rounded-2xl shadow-glass hover-lift border border-cyber-700/50 backdrop-blur-md"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-6 bg-gradient-neon rounded-full flex items-center justify-center text-cyber-950 neon-glow`}
                  >
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-white mb-3 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-cyber-300 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
