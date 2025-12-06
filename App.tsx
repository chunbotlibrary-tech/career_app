import React, { useState, useRef } from 'react';
import { Compass, Sparkles, ChevronRight, RotateCcw, BookOpen, Heart, Brain, Volume2, StopCircle, ArrowRight } from 'lucide-react';
import { UserProfile, SUBJECT_OPTIONS, HOBBY_OPTIONS, SKILL_OPTIONS, RecommendationResponse } from './types';
import { getCareerRecommendations, generateAudioAdvice } from './services/geminiService';
import { SelectionChip } from './components/SelectionChip';
import { CareerCard } from './components/CareerCard';
import { ChatBot } from './components/ChatBot';

const App: React.FC = () => {
  // Step 0 = Landing, 1-3 = Form, 4 = Results
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    subjects: [],
    hobbies: [],
    skills: [],
    additionalInfo: ''
  });

  const toggleSelection = (category: keyof UserProfile, item: string) => {
    setProfile(prev => {
      const currentList = prev[category] as string[];
      if (currentList.includes(item)) {
        return { ...prev, [category]: currentList.filter(i => i !== item) };
      } else {
        return { ...prev, [category]: [...currentList, item] };
      }
    });
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCareerRecommendations(profile);
      setResult(response);
      setStep(4);
    } catch (err) {
      setError("សូមអភ័យទោស មានបញ្ហាក្នុងការភ្ជាប់ជាមួយ AI។ សូមព្យាយាមម្តងទៀត។ (Connection Error)");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    stopAudio();
    setStep(0);
    setResult(null);
    setProfile({ subjects: [], hobbies: [], skills: [], additionalInfo: '' });
  };

  const playAudio = async () => {
    if (!result?.advice) return;
    
    if (isPlaying) {
      stopAudio();
      return;
    }

    setAudioLoading(true);
    try {
      const base64Audio = await generateAudioAdvice(result.advice);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const binaryString = window.atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      
      audioSourceRef.current = source;
      setIsPlaying(true);
    } catch (e) {
      console.error("Audio playback failed", e);
      alert("បរាជ័យក្នុងការលេងសំឡេង (Audio Failed)");
    } finally {
      setAudioLoading(false);
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsPlaying(false);
  };

  const renderLandingPage = () => (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary-600 rounded-full blur-[120px] opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600 rounded-full blur-[100px] opacity-30"></div>
      
      <div className="z-10 text-center max-w-2xl space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-sm font-medium text-primary-300 mb-4">
          <Sparkles size={16} />
          <span>AI Career Counselor for Cambodia</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          ស្វែងរក <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">អាជីពការងារ</span> ដែលសាកសមនឹងអ្នក
        </h1>
        
        <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
          មិនច្បាស់ថាគួររៀនអ្វីមែនទេ? ប្រើប្រាស់បច្ចេកវិទ្យា AI ដើម្បីវិភាគចំណង់ចំណូលចិត្ត និងទេពកោសល្យរបស់អ្នក ដើម្បីទទួលបានការណែនាំផ្លូវដែលត្រឹមត្រូវ។
        </p>

        <button 
          onClick={handleNext}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-primary-600 font-sans rounded-full hover:bg-primary-500 hover:shadow-2xl hover:shadow-primary-500/50 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 focus:ring-offset-slate-900"
        >
          <span>ចាប់ផ្តើមឥឡូវនេះ (Start Now)</span>
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </button>
        
        <div className="flex justify-center gap-8 pt-8 text-slate-500 text-sm">
           <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">Free</span>
              <span>ឥតគិតថ្លៃ</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">Fast</span>
              <span>រហ័សទាន់ចិត្ត</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">Smart</span>
              <span>ឆ្លាតវៃ</span>
           </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm rotate-3">
                <BookOpen className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">មុខវិជ្ជាដែលចូលចិត្ត</h2>
              <p className="text-slate-500">តើអ្នកចូលចិត្តរៀនអ្វីខ្លះនៅសាលា? (Favorite Subjects)</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {SUBJECT_OPTIONS.map(opt => (
                <SelectionChip
                  key={opt}
                  label={opt}
                  selected={profile.subjects.includes(opt)}
                  onClick={() => toggleSelection('subjects', opt)}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="text-center mb-8">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm -rotate-3">
                <Heart className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">ចំណង់ចំណូលចិត្ត</h2>
              <p className="text-slate-500">តើអ្នកចូលចិត្តធ្វើអ្វីនៅពេលទំនេរ? (Hobbies & Interests)</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {HOBBY_OPTIONS.map(opt => (
                <SelectionChip
                  key={opt}
                  label={opt}
                  selected={profile.hobbies.includes(opt)}
                  onClick={() => toggleSelection('hobbies', opt)}
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm rotate-3">
                <Brain className="text-purple-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">ជំនាញ និង បុគ្គលិកលក្ខណៈ</h2>
              <p className="text-slate-500">តើអ្នកមានចំណុចខ្លាំងអ្វីខ្លះ? (Skills & Traits)</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {SKILL_OPTIONS.map(opt => (
                <SelectionChip
                  key={opt}
                  label={opt}
                  selected={profile.skills.includes(opt)}
                  onClick={() => toggleSelection('skills', opt)}
                />
              ))}
            </div>
            
            <div className="mt-8 border-t border-slate-200 pt-6">
              <label className="block text-slate-700 font-medium mb-2 text-center">ព័ត៌មានបន្ថែម (Additional Details)</label>
              <textarea
                className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
                rows={3}
                placeholder="ឧទាហរណ៍៖ ខ្ញុំចង់ធ្វើការងារដែលបានដើរច្រើន ឬចង់ធ្វើការក្នុង office... "
                value={profile.additionalInfo}
                onChange={(e) => setProfile(prev => ({ ...prev, additionalInfo: e.target.value }))}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 0. LANDING PAGE
  if (step === 0) {
    return renderLandingPage();
  }

  // 4. RESULTS PAGE
  if (step === 4 && result) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-12">
        {/* Sticky Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-primary-600">
              <Compass size={24} className="animate-spin-slow" />
              <span className="font-bold text-lg hidden sm:block">ផ្លូវអនាគត (Future Path)</span>
            </div>
            <button 
              onClick={handleReset}
              className="text-slate-600 hover:text-primary-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-all"
            >
              <RotateCcw size={16} /> ចាប់ផ្តើមម្តងទៀត
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Advice & Careers */}
          <div className="lg:col-span-2 space-y-8">
            {/* Advice Section */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                       <Sparkles className="text-yellow-300" />
                       ដំបូន្មានសម្រាប់អ្នក
                    </h2>
                    <button 
                      onClick={playAudio}
                      disabled={audioLoading}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all disabled:opacity-50"
                    >
                      {audioLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : isPlaying ? (
                        <StopCircle size={24} />
                      ) : (
                        <Volume2 size={24} />
                      )}
                    </button>
                 </div>
                 <p className="text-primary-50 leading-relaxed text-lg font-kantumruy">
                   {result.advice}
                 </p>
               </div>
               
               {/* Decor */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* Recommendations List */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 ml-1">អាជីពដែលសាកសមបំផុតទាំង ៣</h3>
              <div className="grid gap-5">
                {result.recommendations.map((career, index) => (
                  <CareerCard key={index} career={career} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ChatBot */}
          <div className="lg:col-span-1">
             <div className="lg:sticky lg:top-24">
                <ChatBot />
                <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-100 text-sm text-yellow-800 text-center">
                  <p>
                    ការណែនាំនេះបង្កើតឡើងដោយ AI ។ សូមពិគ្រោះជាមួយគ្រូ ឬអ្នកជំនាញបន្ថែម។
                  </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    );
  }

  // 1-3. FORM FLOW
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      {loading && (
        <div className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center backdrop-blur-md">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <Compass className="text-primary-600 animate-pulse" size={32} />
             </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mt-6 animate-pulse">កំពុងវិភាគទិន្នន័យ...</h3>
          <p className="text-slate-500 mt-2">AI កំពុងស្វែងរកអាជីព និងសាកលវិទ្យាល័យសម្រាប់អ្នក</p>
        </div>
      )}

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col relative z-10 transition-all duration-300">
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full">
          <div 
            className="h-full bg-primary-600 transition-all duration-500 ease-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 md:p-10 flex-grow flex flex-col">
          {/* Header text for form */}
          <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handleBack} 
                className={`text-slate-400 hover:text-slate-600 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                 <ArrowRight className="rotate-180" size={24} />
              </button>
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">Step {step} of 3</span>
              <div className="w-6"></div> {/* Spacer for alignment */}
          </div>

          {/* Form Content */}
          <div className="flex-grow flex flex-col justify-center">
             {renderStepContent()}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={loading || (step === 1 && profile.subjects.length === 0)}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary-500/20 transform hover:-translate-y-1 active:scale-95
                ${(step === 1 && profile.subjects.length === 0) 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none hover:translate-y-0' 
                  : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400'}
              `}
            >
              {step === 3 ? (
                <>
                  <Sparkles size={22} className={loading ? 'animate-spin' : ''} />
                  មើលលទ្ធផល (Analyze)
                </>
              ) : (
                <>
                  បន្ទាប់ (Next)
                  <ChevronRight size={22} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;