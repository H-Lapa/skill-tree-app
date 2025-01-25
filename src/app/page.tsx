'use client';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-6">
          SkillTree Builder
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Visualize your learning journey with interactive skill trees. 
          Track progress, manage resources, and master complex skills 
          through structured roadmaps.
        </p>
        <Link 
          href="/auth" 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg 
          hover:bg-blue-700 transition-all duration-300 text-lg
          inline-flex items-center gap-2"
        >
          Get Started →
        </Link>
      </header>


      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Why SkillTree?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Visual Learning",
              description: "Map out complex skills in an intuitive tree structure",
              icon: "🌳"
            },
            {
              title: "Progress Tracking",
              description: "Mark milestones and track your learning journey",
              icon: "✅"
            },
            {
              title: "Resource Management",
              description: "Attach videos, articles, and notes to each skill node",
              icon: "📚"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}