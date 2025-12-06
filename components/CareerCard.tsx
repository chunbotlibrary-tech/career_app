import React, { useState } from 'react';
import { CareerRecommendation } from '../types';
import { Briefcase, GraduationCap, Star, CheckCircle2, DollarSign, MapPin, Building2, ChevronDown, ChevronUp } from 'lucide-react';

interface CareerCardProps {
  career: CareerRecommendation;
  index: number;
}

export const CareerCard: React.FC<CareerCardProps> = ({ career, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
      <div className="bg-gradient-to-r from-primary-50 to-white p-5 border-b border-primary-100 flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-3 rounded-xl shadow-md mt-1">
          <Briefcase size={24} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-800">{career.title}</h3>
            {expanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </div>
          <p className="text-slate-600 text-sm mt-2 line-clamp-2">{career.description}</p>
          
          <div className="flex gap-4 mt-3">
             <div className="flex items-center gap-1 text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                <DollarSign size={14} />
                {career.averageSalary}
             </div>
             <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                <GraduationCap size={14} />
                {career.educationPath}
             </div>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-5 space-y-6 bg-white animate-fade-in">
          {/* Match Reason */}
          <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
            <div className="flex gap-2 items-center mb-1">
               <Star className="text-yellow-600" size={18} />
               <h4 className="font-bold text-yellow-800 text-sm">ហេតុអ្វីសាកសម? (Why fit?)</h4>
            </div>
            <p className="text-slate-700 text-sm">{career.matchReason}</p>
          </div>

          {/* Roadmap */}
          <div>
             <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-primary-500" />
                ផែនទីបង្ហាញផ្លូវ (Roadmap)
             </h4>
             <div className="relative border-l-2 border-primary-200 ml-2 space-y-6 pl-6 py-2">
                {career.roadmap?.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary-500 border-2 border-white shadow-sm"></div>
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-wide">{step.stage}</p>
                    <p className="text-sm text-slate-700 mt-1">{step.action}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Universities */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Building2 size={18} className="text-indigo-500" />
              សាកលវិទ្យាល័យដែលណែនាំ (Universities)
            </h4>
            <div className="flex flex-wrap gap-2">
              {career.topUniversities?.map((uni, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-indigo-100">
                  {uni}
                </span>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              ជំនាញចាំបាច់ (Required Skills)
            </h4>
            <div className="flex flex-wrap gap-2">
              {career.requiredSkills.map((skill, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-md border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {!expanded && (
          <div className="bg-slate-50 p-2 text-center text-xs text-slate-400 font-medium hover:bg-slate-100 transition-colors" onClick={() => setExpanded(true)}>
            ចុចដើម្បីមើលលម្អិត (View Details)
          </div>
      )}
    </div>
  );
};