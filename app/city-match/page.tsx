"use client";

import Link from "next/link";
import {
  ChevronDown,
  Sparkles,
  Building2,
  MapPin,
  Clock,
  Heart,
  ArrowRight,
  Lightbulb,
  Compass,
  TreePine,
  Users,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";

const dimensions = [
  {
    id: "lifestyle",
    title: "生活方式",
    subtitle: "Lifestyle Preference",
    left: { letter: "🏙", label: "都市繁华", desc: "热爱快节奏的城市生活" },
    right: { letter: "🌿", label: "宁静自然", desc: "享受慢节奏的田园生活" },
    color: "from-emerald-400 to-teal-500",
    icon: Building2,
  },
  {
    id: "social",
    title: "社交偏好",
    subtitle: "Social Tendency",
    left: { letter: "🎉", label: "热闹社交", desc: "喜欢丰富的社交活动" },
    right: { letter: "🧘", label: "独处静心", desc: "享受个人的独处时光" },
    color: "from-cyan-400 to-blue-500",
    icon: Users,
  },
  {
    id: "environment",
    title: "环境偏好",
    subtitle: "Environment Affinity",
    left: { letter: "🏖", label: "温暖海滨", desc: "偏爱温暖的沿海气候" },
    right: { letter: "🏔", label: "四季分明", desc: "喜欢分明的季节变化" },
    color: "from-orange-400 to-rose-500",
    icon: TreePine,
  },
  {
    id: "pace",
    title: "生活节奏",
    subtitle: "Life Pace",
    left: { letter: "⚡", label: "高效快速", desc: "追求效率和竞争力" },
    right: { letter: "☕", label: "悠闲舒适", desc: "享受闲适和慢生活" },
    color: "from-purple-400 to-violet-500",
    icon: Zap,
  },
];

const features = [
  {
    icon: Compass,
    title: "多维度分析",
    desc: "从生活方式、社交、环境、节奏四个维度精准评估",
  },
  {
    icon: Clock,
    title: "3分钟完成",
    desc: "简洁高效的问题设计，快速获得你的理想城市",
  },
  {
    icon: Heart,
    title: "完全免费",
    desc: "无需注册，无隐藏费用，立即开始测试",
  },
];

export default function CityMatchLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      <SiteHeader returnTo="/city-match" variant="scroll-surface" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700" />

        {/* Floating Geometric Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-32 right-32 w-20 h-20 border-2 border-white/20 rotate-45 animate-float-slow hidden md:block" />
          <div className="absolute bottom-40 left-20 w-16 h-16 bg-white/10 rounded-lg rotate-12 animate-float hidden md:block" />
          <div className="absolute top-1/2 right-16 w-12 h-12 border-2 border-white/30 rounded-full animate-float hidden md:block" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-16 sm:pt-20">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              发现理想之城
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-outfit text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
            城市匹配
          </h1>

          {/* Subtitle */}
          <p className="font-worksans text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 animate-fade-in-up">
            找到最适合你的城市
          </p>
          <p className="font-worksans text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-12 animate-fade-in-up">
            通过分析你的性格特征和生活方式偏好，为你推荐最适合居住的城市，开启理想生活的新篇章
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/city-match/test?mode=quick"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-teal-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              快速版（8题 / 约3分钟）
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/city-match/test?mode=full"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-teal-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              完整版（25+题 / 约8分钟）
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-16 animate-fade-in-up">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white font-outfit">10+</div>
              <div className="text-white/70 text-sm">覆盖城市</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white font-outfit">4</div>
              <div className="text-white/70 text-sm">评估维度</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white font-outfit">3min</div>
              <div className="text-white/70 text-sm">快速完成</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce-slow">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card dark:glass-card-dark rounded-3xl p-8 sm:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
                  <Lightbulb className="w-4 h-4" />
                  什么是城市匹配
                </div>
                <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  用性格找到理想城市
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  城市匹配测试基于心理学理论和城市特征研究，通过分析你在生活方式、社交偏好、环境喜好和生活节奏四个维度的倾向，为你精准推荐最契合的城市。
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  每座城市都有独特的性格，就像每个人一样。找到与你「性格相合」的城市，不仅是选择一个居住地，更是选择一种生活方式。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-outfit font-semibold text-slate-900 dark:text-white mb-2">居住选择</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">找到最适合的城市</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Compass className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-outfit font-semibold text-slate-900 dark:text-white mb-2">旅行灵感</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">探索值得一去的目的地</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-outfit font-semibold text-slate-900 dark:text-white mb-2">了解自我</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">发现你的生活偏好</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-outfit font-semibold text-slate-900 dark:text-white mb-2">生活规划</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">规划理想的未来生活</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Dimensions Section */}
      <section className="py-12 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              四大评估维度
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              通过四个维度分析你的性格特征，匹配最契合的城市
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {dimensions.map((dim) => (
              <div
                key={dim.id}
                className="group relative bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${dim.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm`} />
                <div className="absolute inset-[1px] rounded-2xl bg-slate-50 dark:bg-slate-800 -z-10" />

                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-outfit text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {dim.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{dim.subtitle}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dim.color} flex items-center justify-center shadow-lg`}>
                    <dim.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${dim.color} text-white font-outfit text-2xl font-bold mb-2 shadow-lg`}>
                      {dim.left.letter}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">{dim.left.label}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{dim.left.desc}</div>
                  </div>

                  <div className="px-4 text-slate-300 dark:text-slate-600">
                    <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
                  </div>

                  <div className="text-center flex-1">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-outfit text-2xl font-bold mb-2 group-hover:bg-gradient-to-br ${dim.color} group-hover:text-white transition-all duration-300`}>
                      {dim.right.letter}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">{dim.right.label}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{dim.right.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              为什么选择 Mind Mirror
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              精心设计的测试体验，让寻找理想城市之旅更加轻松愉快
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-outfit text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600" />

            {/* Content */}
            <div className="relative z-10 py-16 px-8 sm:px-12 text-center">
              <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                准备好发现理想城市了吗？
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                只需几分钟，找到与你性格最契合的城市，开启理想生活的新篇章
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/city-match/test?mode=quick"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-teal-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  快速版（8题 / 约3分钟）
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/city-match/test?mode=full"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-teal-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  完整版（25+题 / 约8分钟）
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/70 text-sm">
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  返回首页
                </Link>
                <span className="hidden sm:inline">|</span>
                <span>免费 · 无需注册 · 即时结果</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-outfit font-bold text-slate-900 dark:text-white text-xl">
            Mind Mirror
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © 2026 Mind Mirror. 探索真实的自己。
          </p>
        </div>
      </footer>
    </main>
  );
}
