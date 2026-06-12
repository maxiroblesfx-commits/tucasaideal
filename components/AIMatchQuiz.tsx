'use client';

import { useState } from 'react';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  priceLabel: string;
  bedrooms: number;
  area: number;
  image: string;
  score: number;
}

interface AIMatchQuizProps {
  properties: Property[];
  onViewProperty: (id: number) => void;
}

export default function AIMatchQuiz({ properties, onViewProperty }: AIMatchQuizProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "¿Qué tipo de propiedad buscas?",
      options: ["casa", "departamento", "ph", "terreno"],
      labels: ["Casa", "Departamento", "PH / Townhouse", "Estancia / Terreno"]
    },
    {
      id: 2,
      question: "¿Cuál es tu presupuesto?",
      options: ["low", "mid", "high"],
      labels: ["Hasta USD 1M", "USD 1M - 3M", "Más de USD 3M"]
    },
    {
      id: 3,
      question: "¿Cuántos dormitorios necesitas?",
      options: ["2", "3", "4", "5"],
      labels: ["2+", "3+", "4+", "5+"]
    },
    {
      id: 4,
      question: "¿Qué es más importante?",
      options: ["pileta", "smart", "vista", "jardin"],
      labels: ["Pileta / Spa", "Smart Home", "Vista al río", "Jardín / Quincho"]
    },
    {
      id: 5,
      question: "¿Para qué la usarás principalmente?",
      options: ["familia", "inversion", "segunda", "wellness"],
      labels: ["Vivienda familiar", "Inversión", "Segunda residencia", "Wellness & Relax"]
    }
  ];

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (questionId < 5) {
      setStep(questionId + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({});
    setShowResults(false);
  };

  // Simple recommendation logic
  const getRecommendations = () => {
    let filtered = [...properties];
    
    // Basic filtering based on answers
    if (answers[2] === 'low') filtered = filtered.filter(p => p.price < 1500000);
    if (answers[2] === 'mid') filtered = filtered.filter(p => p.price >= 1000000 && p.price <= 3000000);
    if (answers[2] === 'high') filtered = filtered.filter(p => p.price > 2500000);
    
    if (answers[3]) {
      const minBeds = parseInt(answers[3]);
      filtered = filtered.filter(p => p.bedrooms >= minBeds);
    }
    
    return filtered.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const recommendations = showResults ? getRecommendations() : [];

  if (showResults) {
    return (
      <div className="bg-white/5 border border-white/10 p-9 rounded-3xl">
        <div className="text-center mb-6">
          <div className="text-[#C5A46E] text-sm font-semibold">RESULTADOS DEL MATCH IA v2</div>
          <div className="text-2xl font-semibold mt-1 text-white">Estas son tus 3 propiedades ideales</div>
        </div>
        
        <div className="space-y-4">
          {recommendations.map(prop => (
            <div 
              key={prop.id}
              onClick={() => onViewProperty(prop.id)}
              className="flex gap-4 bg-white/5 hover:bg-white/10 p-4 rounded-2xl cursor-pointer border border-white/10"
            >
              <img src={prop.image} className="w-24 h-20 object-cover rounded-xl" alt={prop.title} />
              <div className="flex-1 text-white">
                <div className="font-semibold">{prop.title}</div>
                <div className="text-sm text-white/70">{prop.location} • {prop.priceLabel}</div>
                <div className="text-xs mt-1">Puntuación IA: <span className="font-bold">{prop.score}</span></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={resetQuiz}
            className="text-sm font-semibold border border-white/30 px-8 py-3 rounded-2xl text-white hover:bg-white/10"
          >
            Hacer el test nuevamente
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[step - 1];

  return (
    <div className="bg-white/5 border border-white/10 p-9 rounded-3xl text-white">
      <div className="mb-8">
        <div className="text-[#C5A46E] text-sm font-semibold mb-2">MATCH IA v2 • PASO {step}/5</div>
        <div className="font-semibold text-xl">{currentQuestion.question}</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(currentQuestion.id, option)}
            className="border border-white/30 hover:bg-white/10 px-5 py-3 rounded-2xl text-sm text-left transition-colors"
          >
            {currentQuestion.labels[index]}
          </button>
        ))}
      </div>
    </div>
  );
}
