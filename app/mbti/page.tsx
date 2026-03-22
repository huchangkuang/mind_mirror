"use client";

import Link from "next/link";
import {
  ChevronDown,
  Sparkles,
  Brain,
  Users,
  Target,
  Zap,
  Clock,
  Heart,
  ArrowRight,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";

// MBTI 维度数据
const dimensions = [
  {
    id: "ei",
    title: "能量来源",
    subtitle: "Extraversion / Introversion",
    left: { letter: "E", label: "外向", desc: "从外部世界获取能量" },
    right: { letter: "I", label: "内向", desc: "从内心世界获取能量" },
    color: "from-orange-400 to-red-500",
    icon: Users,
  },
  {
    id: "sn",
    title: "信息收集",
    subtitle: "Sensing / Intuition",
    left: { letter: "S", label: "实感", desc: "关注具体细节和事实" },
    right: { letter: "N", label: "直觉", desc: "关注模式和可能性" },
    color: "from-green-400 to-emerald-500",
    icon: Target,
  },
  {
    id: "tf",
    title: "决策方式",
    subtitle: "Thinking / Feeling",
    left: { letter: "T", label: "思考", desc: "基于逻辑和客观分析" },
    right: { letter: "F", label: "情感", desc: "基于价值观和人情" },
    color: "from-blue-400 to-cyan-500",
    icon: Brain,
  },
  {
    id: "jp",
    title: "生活方式",
    subtitle: "Judging / Perceiving",
    left: { letter: "J", label: "判断", desc: "喜欢计划和结构" },
    right: { letter: "P", label: "知觉", desc: "喜欢灵活和开放" },
    color: "from-purple-400 to-violet-500",
    icon: Sparkles,
  },
];

// 特色亮点数据
const features = [
  {
    icon: Brain,
    title: "科学可靠",
    desc: "基于荣格心理类型理论，经过数十年验证",
  },
  {
    icon: Clock,
    title: "5分钟完成",
    desc: "简洁高效的问题设计，快速获得结果",
  },
  {
    icon: Heart,
    title: "完全免费",
    desc: "无需注册，无隐藏费用，立即开始测试",
  },
];

export default function MbtiLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      <SiteHeader returnTo="/mbti" variant="scroll-surface" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-hero" />

        {/* Floating Geometric Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" />
          {/* Geometric Shapes */}
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
              探索真实的自我
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-outfit text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
            MBTI
          </h1>

          {/* Subtitle */}
          <p className="font-worksans text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 animate-fade-in-up">
            探索你的性格类型
          </p>
          <p className="font-worksans text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-12 animate-fade-in-up">
            通过科学的 MBTI 人格测试，发现你的独特优势，理解自己的行为模式，开启自我认知的新篇章
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/mbti/test?mode=quick"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              快速版（2选1）
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/mbti/test?mode=deep"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              深度版（5级量表）
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-16 animate-fade-in-up">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white font-outfit">16</div>
              <div className="text-white/70 text-sm">种人格类型</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white font-outfit">4</div>
              <div className="text-white/70 text-sm">个核心维度</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white font-outfit">5min</div>
              <div className="text-white/70 text-sm">快速完成</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce-slow">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* MBTI Introduction Section */}
      <section className="py-12 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card dark:glass-card-dark rounded-3xl p-8 sm:p-12 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                  <Lightbulb className="w-4 h-4" />
                  什么是 MBTI
                </div>
                <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                  科学的人格类型理论
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  MBTI（迈尔斯-布里格斯类型指标）是基于心理学家卡尔·荣格理论发展而来的人格测评工具。它通过四个核心维度，将人格分为16种独特类型，帮助人们更好地理解自己和他人。
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  自20世纪40年代诞生以来，MBTI已被广泛应用于职业规划、团队建设、人际关系等领域，成为全球最受欢迎的人格测评工具之一。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-outfit font-semibold text-slate-900 dark:text-white mb-2">职业规划</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">发现适合的职业方向</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-outfit font-semibold text-slate-900 dark:text-white mb-2">人际关系</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">改善沟通与理解</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-outfit font-semibold text-slate-900 dark:text-white mb-2">自我认知</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">了解内在驱动力</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-outfit font-semibold text-slate-900 dark:text-white mb-2">个人成长</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">发掘潜在优势</p>
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
              四大核心维度
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              MBTI 通过四个维度描述人格差异，每个维度代表一种偏好倾向
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {dimensions.map((dim) => (
              <div
                key={dim.id}
                className="group relative bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                {/* Gradient Border on Hover */}
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
              精心设计的测试体验，让自我探索之旅更加轻松愉快
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
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
            <div className="absolute inset-0 gradient-cta" />

            {/* Content */}
            <div className="relative z-10 py-16 px-8 sm:px-12 text-center">
              <h2 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                准备好探索自己了吗？
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                只需几分钟，获取专业的 MBTI 人格类型分析，开启自我认知的新篇章
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/mbti/test?mode=quick"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  快速版（2选1）
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/mbti/test?mode=deep"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  深度版（5级量表）
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
