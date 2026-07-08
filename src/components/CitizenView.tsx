import React, { useState, useEffect } from 'react';
import { 
  Mic, Upload, FileText, Search, ThumbsUp, ThumbsDown, 
  MessageSquare, Send, CheckCircle, Sparkles, MapPin, AlertCircle 
} from 'lucide-react';
import { type CitizenRequest, type Village } from '../db/mockDb';

interface CitizenViewProps {
  requests: CitizenRequest[];
  villages: Village[];
  onAddRequest: (req: CitizenRequest) => void;
  onVoteRequest: (id: string, type: 'support' | 'oppose') => void;
}

export const CitizenView: React.FC<CitizenViewProps> = ({ 
  requests, 
  villages, 
  onAddRequest,
  onVoteRequest 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'submit' | 'track' | 'bot'>('submit');
  const [language, setLanguage] = useState<string>('Bengali');
  const [channel, setChannel] = useState<'Voice' | 'Photo' | 'Text'>('Voice');
  
  // Voice Submission State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [voiceParsedData, setVoiceParsedData] = useState<{
    original: string;
    translated: string;
    category: 'Roads' | 'Education' | 'Health' | 'Water' | 'Sanitation' | 'Electricity';
    subCategory: string;
    locationId: string;
    urgency: number;
  } | null>(null);

  // Photo Submission State
  const [photoType, setPhotoType] = useState<'bridge' | 'well' | 'school' | 'none'>('none');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoParsedData, setPhotoParsedData] = useState<{
    extractedText: string;
    category: 'Roads' | 'Education' | 'Health' | 'Water' | 'Sanitation' | 'Electricity';
    locationId: string;
    urgency: number;
    gpsCoords: string;
  } | null>(null);

  // Text Form State
  const [textCategory, setTextCategory] = useState<'Roads' | 'Education' | 'Health' | 'Water' | 'Sanitation' | 'Electricity'>('Roads');
  const [textSubCategory, setTextSubCategory] = useState('');
  const [textLocation, setTextLocation] = useState('AS1');
  const [textMessage, setTextMessage] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [contact, setContact] = useState('');

  // Track Request State
  const [searchId, setSearchId] = useState('REQ-001');
  const [trackedRequest, setTrackedRequest] = useState<CitizenRequest | null>(null);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Namaste! Welcome to LokNiti AI Citizen Assistant. How can I help you today?' },
    { sender: 'bot', text: 'Type "report" to submit a grievance, or "status" to track your request.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Track the default selection
  useEffect(() => {
    const defaultReq = requests.find(r => r.id === searchId);
    if (defaultReq) setTrackedRequest(defaultReq);
  }, [requests, searchId]);

  // Voice pre-loaded audio samples
  const samples = [
    {
      lang: 'Bengali',
      name: 'Bimal Sen (Drainage Complaint)',
      audioText: 'বর্ষা হলেই আমাদের কাশীপুর রেল কলোনি রোডটা সম্পূর্ণ ডুবে যায়, ২ ফুট জল জমে থাকে। নোংরা জল ঘরে ঢুকে পড়ছে, নিকাশি সংস্কার প্রয়োজন।',
      translation: 'Whenever monsoon starts, our Kashipur Railway Colony Road gets completely submerged under 2 feet of water. Dirty sewage is entering homes, urgent drainage cleanup needed.',
      category: 'Roads',
      subCategory: 'Drainage & Waterlogging',
      location: 'AS1',
      urgency: 0.92
    },
    {
      lang: 'Hindi',
      name: 'Sunita Devi (Filtration Plant Request)',
      audioText: 'हमारे जोरासांको वार्ड ३९ में पीने के पानी में पीलापन आ रहा है और जंग की गंध है। बच्चों की सेहत खराब हो रही है। फिल्टर प्लांट लगायें।',
      translation: 'In Jorasanko Ward 39, drinking water is yellowish with a rusty smell. Childrens health is deteriorating. Install community filtration plant.',
      category: 'Water',
      subCategory: 'Filtration Plant installation',
      location: 'AS4',
      urgency: 0.88
    },
    {
      lang: 'Kannada',
      name: 'Ramesh Gowda (School Roof Leakage)',
      audioText: 'ಎಂಟಾಲಿ ಶಾಲೆಯ ಛಾವಣಿ ಸೋರುತ್ತಿದೆ, ಮಕ್ಕಳಿಗೆ ಕೂರಲು ಜಾಗವಿಲ್ಲ. ಕೊಠಡಿ ದುರಸ್ತಿ ಬೇಕು.',
      translation: 'Entally Primary School building is very old and roof leaks during rains. Students cannot sit in classroom.',
      category: 'Education',
      subCategory: 'Primary School Repairs',
      location: 'AS7',
      urgency: 0.78
    }
  ];

  const handleSelectSample = (sample: typeof samples[0]) => {
    setLanguage(sample.lang);
    setIsRecording(true);
    setRecordingProgress(0);
    setVoiceParsedData(null);
    
    // Simulate recording progress animation
    const interval = setInterval(() => {
      setRecordingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecording(false);
          // Load parsed data
          setVoiceParsedData({
            original: sample.audioText,
            translated: sample.translation,
            category: sample.category as any,
            subCategory: sample.subCategory,
            locationId: sample.location,
            urgency: sample.urgency
          });
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingProgress(0);
    setVoiceParsedData(null);
    
    // Simulate raw custom user recording in selected language
    const interval = setInterval(() => {
      setRecordingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecording(false);
          
          let originalText = "আমাদের এলাকায় জলের খুব অভাব। রোজ জলের জন্য মারামারি হয়।";
          let translatedText = "There is a huge water shortage in our area. Daily fights occur over water.";
          let cat = 'Water';
          let sub = 'Drinking Water Source';
          let loc = 'AS5';
          let urg = 0.82;

          if (language === 'Hindi') {
            originalText = "अस्पताल में डॉक्टर नहीं आते हैं, मरीजों को इलाज नहीं मिलता।";
            translatedText = "Doctors do not come to the hospital, patients are not getting treated.";
            cat = 'Health';
            sub = 'PHC Doctor Shortage';
            loc = 'AS3';
            urg = 0.85;
          } else if (language === 'English') {
            originalText = "The streets have huge potholes and no streetlights are working.";
            translatedText = "The streets have huge potholes and no streetlights are working.";
            cat = 'Roads';
            sub = 'Pothole Repair';
            loc = 'AS1';
            urg = 0.65;
          }

          setVoiceParsedData({
            original: originalText,
            translated: translatedText,
            category: cat as any,
            subCategory: sub,
            locationId: loc,
            urgency: urg
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handlePhotoSelect = (type: 'bridge' | 'well' | 'school') => {
    setPhotoType(type);
    setIsProcessingPhoto(true);
    setPhotoParsedData(null);

    // Simulate AI vision parsing
    setTimeout(() => {
      setIsProcessingPhoto(false);
      if (type === 'bridge') {
        setPhotoParsedData({
          extractedText: "[IMAGE ANALYZER] Detected damaged structural components, rusted bridge trusses, waterlogging, and safety hazards.",
          category: 'Roads',
          locationId: 'AS1',
          urgency: 0.94,
          gpsCoords: "22.5726° N, 88.3639° E"
        });
      } else if (type === 'well') {
        setPhotoParsedData({
          extractedText: "[IMAGE ANALYZER] Detected dried concrete well, cracks in brick wall, empty buckets, dried land surrounding structure.",
          category: 'Water',
          locationId: 'AS4',
          urgency: 0.88,
          gpsCoords: "22.5691° N, 88.3512° E"
        });
      } else {
        setPhotoParsedData({
          extractedText: "[IMAGE ANALYZER] Classroom with broken benches, overcrowding (approx 55 kids visible), lack of blackboards.",
          category: 'Education',
          locationId: 'AS7',
          urgency: 0.76,
          gpsCoords: "22.5894° N, 88.3712° E"
        });
      }
    }, 1500);
  };

  const handleSubmitGrievance = (
    cat: 'Roads' | 'Education' | 'Health' | 'Water' | 'Sanitation' | 'Electricity',
    sub: string,
    origText: string,
    transText: string,
    loc: string,
    urg: number
  ) => {
    const newReq: CitizenRequest = {
      id: `REQ-${String(requests.length + 1).padStart(3, '0')}`,
      citizenName: citizenName || 'Anonymous Citizen',
      contact: contact || '+91 99999 88888',
      channel: channel === 'Voice' ? 'WhatsApp' : channel === 'Photo' ? 'Web' : 'Web',
      category: cat,
      subCategory: sub,
      originalText: origText,
      translatedText: transText,
      language: channel === 'Voice' ? language : 'English',
      locationId: loc,
      urgency: urg,
      sentiment: 'Negative',
      timestamp: new Date().toISOString(),
      status: 'Submitted',
      supportVotes: 1,
      opposeVotes: 0,
      evidenceNotes: 'System automatically verified citizen location coordinates and cross-referenced with Census 2021 database.',
      evidenceMatch: true
    };
    
    onAddRequest(newReq);
    
    // Switch to Track Request tab and search for the newly added request
    setSearchId(newReq.id);
    setTrackedRequest(newReq);
    setActiveSubTab('track');
    
    // Reset inputs
    setCitizenName('');
    setContact('');
    setVoiceParsedData(null);
    setPhotoParsedData(null);
    setPhotoType('none');
    setTextMessage('');
    setTextSubCategory('');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Simulate Bot Response Logic
    setTimeout(() => {
      let botResponse = "I'm sorry, I didn't quite catch that. You can type 'report' to file a complaint or 'status' to track a request.";
      const query = userMsg.toLowerCase();
      
      if (query.includes('hi') || query.includes('hello')) {
        botResponse = "Namaste! Hope you are doing well. Please tell me which village you reside in, so we can check local grievances.";
      } else if (query.includes('report') || query.includes('complain') || query.includes('grievance')) {
        botResponse = "Sure, I can help you file a complaint. What is the issue category? Roads, Water, Education, or Health?";
      } else if (query.includes('water') || query.includes('road') || query.includes('health') || query.includes('school')) {
        botResponse = "Understood. Please send a brief description of the problem, and if possible, describe your village name.";
      } else if (query.includes('panchpara') || query.includes('madhupur') || query.includes('haripur') || query.includes('kalyanpur')) {
        const foundVill = villages.find(v => query.includes(v.name.toLowerCase()));
        botResponse = `Excellent. I have recorded your location as ${foundVill?.name}. An AI tracking ID has been queued for validation. Thank you!`;
      } else if (query.includes('status') || query.includes('track')) {
        botResponse = "Please provide your Tracking ID (for example, type: REQ-001) to search the system database.";
      } else if (query.startsWith('req-')) {
        const reqId = query.toUpperCase();
        const found = requests.find(r => r.id === reqId);
        if (found) {
          botResponse = `Status for ${found.id} (${found.subCategory}): Currently at stage [${found.status}]. It has received 👍 ${found.supportVotes} community votes.`;
        } else {
          botResponse = `Sorry, I could not find any request matching tracking ID ${reqId}. Please check the number and try again.`;
        }
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="citizen-container">
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          className={`btn-secondary ${activeSubTab === 'submit' ? 'btn-primary' : ''}`}
          onClick={() => setActiveSubTab('submit')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Sparkles size={16} /> File Grievance / Proposal
        </button>
        <button 
          className={`btn-secondary ${activeSubTab === 'track' ? 'btn-primary' : ''}`}
          onClick={() => setActiveSubTab('track')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Search size={16} /> Track & Vote Requests
        </button>
        <button 
          className={`btn-secondary ${activeSubTab === 'bot' ? 'btn-primary' : ''}`}
          onClick={() => setActiveSubTab('bot')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <MessageSquare size={16} /> WhatsApp AI Chatbot
        </button>
      </div>

      {activeSubTab === 'submit' && (
        <div className="dashboard-grid">
          {/* Form Ingestion Left */}
          <div className="glass-card">
            <h2 className="glass-card-title">
              <Sparkles size={20} className="text-cyan" /> Report Local Gaps
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Select Language
                </label>
                <select 
                  className="chat-input" 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: '100%', borderRadius: '0.5rem' }}
                >
                  <option value="Bengali">বাংলা (Bengali)</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                  <option value="English">English</option>
                </select>
              </div>

              {/* Channels Selector */}
              <div style={{ display: 'flex', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <button 
                  onClick={() => setChannel('Voice')}
                  style={{ flex: 1, padding: '0.75rem', background: channel === 'Voice' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', color: channel === 'Voice' ? 'var(--accent-cyan)' : 'var(--text-secondary)', border: 'none', borderRight: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: channel === 'Voice' ? 600 : 400 }}
                >
                  <Mic size={16} /> Voice Recording
                </button>
                <button 
                  onClick={() => setChannel('Photo')}
                  style={{ flex: 1, padding: '0.75rem', background: channel === 'Photo' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', color: channel === 'Photo' ? 'var(--accent-cyan)' : 'var(--text-secondary)', border: 'none', borderRight: '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: channel === 'Photo' ? 600 : 400 }}
                >
                  <Upload size={16} /> Photo Upload (OCR)
                </button>
                <button 
                  onClick={() => setChannel('Text')}
                  style={{ flex: 1, padding: '0.75rem', background: channel === 'Text' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', color: channel === 'Text' ? 'var(--accent-cyan)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontWeight: channel === 'Text' ? 600 : 400 }}
                >
                  <FileText size={16} /> Web Form
                </button>
              </div>

              {/* Voice Ingestion */}
              {channel === 'Voice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Multilingual Voice AI</span>
                    {isRecording && <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>● Recording... {recordingProgress}%</span>}
                  </div>
                  
                  {isRecording ? (
                    <div className="soundwave-container">
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                      <div className="soundwave-bar"></div>
                    </div>
                  ) : (
                    <button onClick={handleStartRecording} className="btn-primary" style={{ justifyContent: 'center' }}>
                      <Mic size={18} /> Record in {language}
                    </button>
                  )}

                  {/* Preloaded Audio Samples */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                      Or test with preloaded audio samples:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {samples.map((s, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleSelectSample(s)}
                          className="btn-secondary" 
                          style={{ fontSize: '0.75rem', justifyContent: 'flex-start', padding: '0.4rem 0.75rem' }}
                          disabled={isRecording}
                        >
                          <Mic size={12} className="text-cyan" /> {s.name} ({s.lang})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Photo Ingestion */}
              {channel === 'Photo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Image OCR & Location Extractor</span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handlePhotoSelect('bridge')}
                      className={`btn-secondary ${photoType === 'bridge' ? 'btn-primary' : ''}`}
                      style={{ fontSize: '0.75rem', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem' }}
                    >
                      🌉 Damaged Bridge
                    </button>
                    <button 
                      onClick={() => handlePhotoSelect('well')}
                      className={`btn-secondary ${photoType === 'well' ? 'btn-primary' : ''}`}
                      style={{ fontSize: '0.75rem', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem' }}
                    >
                      🕳️ Dry Water Well
                    </button>
                    <button 
                      onClick={() => handlePhotoSelect('school')}
                      className={`btn-secondary ${photoType === 'school' ? 'btn-primary' : ''}`}
                      style={{ fontSize: '0.75rem', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem' }}
                    >
                      🏫 Deficient School
                    </button>
                  </div>

                  {isProcessingPhoto && (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--accent-cyan)', fontSize: '0.875rem' }}>
                      <Sparkles size={16} style={{ animation: 'spin 1.5s linear infinite' }} /> Processing image metadata & running OCR...
                    </div>
                  )}
                </div>
              )}

              {/* Web Text Form */}
              {channel === 'Text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Category</label>
                      <select 
                        className="chat-input" 
                        value={textCategory} 
                        onChange={(e) => setTextCategory(e.target.value as any)}
                        style={{ width: '100%', borderRadius: '0.5rem' }}
                      >
                        <option value="Roads">Roads</option>
                        <option value="Water">Water</option>
                        <option value="Education">Education</option>
                        <option value="Health">Health</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Electricity">Electricity</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Location / Village</label>
                      <select 
                        className="chat-input" 
                        value={textLocation} 
                        onChange={(e) => setTextLocation(e.target.value)}
                        style={{ width: '100%', borderRadius: '0.5rem' }}
                      >
                        {villages.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Sub-Category</label>
                    <input 
                      type="text" 
                      className="chat-input" 
                      placeholder="e.g. Broken Potholes, Tube well installation" 
                      value={textSubCategory} 
                      onChange={(e) => setTextSubCategory(e.target.value)}
                      style={{ width: '100%', borderRadius: '0.5rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Grievance Description</label>
                    <textarea 
                      className="chat-input" 
                      placeholder="Explain the problem..." 
                      rows={3}
                      value={textMessage}
                      onChange={(e) => setTextMessage(e.target.value)}
                      style={{ width: '100%', borderRadius: '0.5rem', resize: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* Citizen Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Full Name (Optional)</label>
                  <input 
                    type="text" 
                    className="chat-input" 
                    placeholder="Enter name"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    style={{ width: '100%', borderRadius: '0.5rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Mobile No. (for Updates)</label>
                  <input 
                    type="text" 
                    className="chat-input" 
                    placeholder="+91 XXXXX XXXXX"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    style={{ width: '100%', borderRadius: '0.5rem' }}
                  />
                </div>
              </div>

              {channel === 'Text' && (
                <button 
                  onClick={() => handleSubmitGrievance(textCategory, textSubCategory || 'General Request', textMessage, textMessage, textLocation, 0.60)}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={!textMessage}
                >
                  Submit Grievance
                </button>
              )}
            </div>
          </div>

          {/* AI Real-time Parsing Output Right */}
          <div className="glass-card">
            <h2 className="glass-card-title">
              <Sparkles size={20} className="text-cyan" /> LokNiti AI Ingestion Pipeline
            </h2>

            {channel === 'Voice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {voiceParsedData ? (
                  <>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                        <Sparkles size={12} /> Real-time Speech-to-Text ({language})
                      </span>
                      <p style={{ marginTop: '0.5rem', fontStyle: 'italic', fontSize: '0.9rem', color: '#fff' }}>
                        "{voiceParsedData.original}"
                      </p>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                        <Sparkles size={12} /> English Normalization / Translation
                      </span>
                      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        "{voiceParsedData.translated}"
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="stat-card" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Extracted Category</span>
                        <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>{voiceParsedData.category}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sub: {voiceParsedData.subCategory}</div>
                      </div>
                      <div className="stat-card" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Entity Geotag</span>
                        <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} /> {villages.find(v => v.id === voiceParsedData.locationId)?.name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {voiceParsedData.locationId}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600 }}>AI Urgency Severity Index</span>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Based on keyword sentiment & security triggers</p>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-rose)', fontFamily: 'var(--font-display)' }}>
                        {(voiceParsedData.urgency * 100).toFixed(0)}%
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSubmitGrievance(voiceParsedData.category, voiceParsedData.subCategory, voiceParsedData.original, voiceParsedData.translated, voiceParsedData.locationId, voiceParsedData.urgency)}
                      className="btn-primary" 
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Confirm and Submit Proposal
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', border: '2px dashed var(--glass-border)', borderRadius: '0.75rem', color: 'var(--text-muted)' }}>
                    <Mic size={36} style={{ marginBottom: '1rem' }} />
                    <p>Start recording or click a preloaded sample</p>
                    <p style={{ fontSize: '0.75rem' }}>AI will analyze voice notes, translate, and tag locations</p>
                  </div>
                )}
              </div>
            )}

            {channel === 'Photo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {photoParsedData ? (
                  <>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                        <Sparkles size={12} /> Computer Vision OCR OCR Result
                      </span>
                      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#fff' }}>
                        {photoParsedData.extractedText}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="stat-card" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Detected Category</span>
                        <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>{photoParsedData.category}</div>
                      </div>
                      <div className="stat-card" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>GPS Metadata Extracted</span>
                        <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                          <MapPin size={12} /> {photoParsedData.gpsCoords}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Village match: {villages.find(v => v.id === photoParsedData.locationId)?.name}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 600 }}>Visual Severity Estimate</span>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Parsed automatically from image structural damage</p>
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-rose)', fontFamily: 'var(--font-display)' }}>
                        {(photoParsedData.urgency * 100).toFixed(0)}%
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSubmitGrievance(photoParsedData.category, photoType === 'bridge' ? 'Bridge Reconstruction' : photoType === 'well' ? 'Well Deepening' : 'School Renovation', `Photo upload representing local ${photoParsedData.category.toLowerCase()} damage.`, `Photo upload representing local ${photoParsedData.category.toLowerCase()} damage.`, photoParsedData.locationId, photoParsedData.urgency)}
                      className="btn-primary" 
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Confirm photo & File Grievance
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '250px', border: '2px dashed var(--glass-border)', borderRadius: '0.75rem', color: 'var(--text-muted)' }}>
                    <Upload size={36} style={{ marginBottom: '1rem' }} />
                    <p>Select a sample image on the left</p>
                    <p style={{ fontSize: '0.75rem' }}>AI will analyze structural defects & retrieve GPS coords</p>
                  </div>
                )}
              </div>
            )}

            {channel === 'Text' && (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '250px', color: 'var(--text-secondary)' }}>
                <AlertCircle size={32} className="text-cyan" style={{ marginBottom: '0.75rem' }} />
                <p style={{ textAlign: 'center', fontSize: '0.9rem', maxWidth: '300px' }}>
                  Web submissions are routed directly to the AI priority engine, bypassing speech translation, but will still be checked for duplicates & evidence matches.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'track' && (
        <div className="three-column-grid">
          {/* Timeline Tracking Left */}
          <div className="glass-card">
            <h2 className="glass-card-title">
              <Search size={20} className="text-cyan" /> Request Tracker
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Enter Tracking ID (e.g. REQ-001)" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>

            {trackedRequest ? (
              <div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{trackedRequest.id}: {trackedRequest.subCategory}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{trackedRequest.category}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Reporter: {trackedRequest.citizenName} | Village: {villages.find(v => v.id === trackedRequest.locationId)?.name}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#fff', fontStyle: 'italic', borderLeft: '2px solid var(--accent-cyan)', paddingLeft: '0.5rem', marginTop: '0.5rem' }}>
                    "{trackedRequest.translatedText}"
                  </p>
                </div>

                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Development Lifecycle</h3>
                
                <div className="timeline">
                  <div className="timeline-item">
                    <div className={`timeline-badge completed`}><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Grievance Submitted</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ingested via {trackedRequest.channel} channel on {new Date(trackedRequest.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="timeline-item">
                    <div className={`timeline-badge ${['AI Verified', 'Recommended', 'Approved', 'In Progress', 'Completed'].includes(trackedRequest.status) ? 'completed' : 'active'}`}><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>AI Verified & Duplicated Checked</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{trackedRequest.evidenceNotes}</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className={`timeline-badge ${['Recommended', 'Approved', 'In Progress', 'Completed'].includes(trackedRequest.status) ? 'completed' : trackedRequest.status === 'AI Verified' ? 'active' : ''}`}><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Priority List Evaluation</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {trackedRequest.status === 'Submitted' || trackedRequest.status === 'AI Verified' 
                          ? 'Queued for prioritization ranking next cycle.' 
                          : 'Ranked and placed in MP development proposal pipeline.'}
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className={`timeline-badge ${['Approved', 'In Progress', 'Completed'].includes(trackedRequest.status) ? 'completed' : trackedRequest.status === 'Recommended' ? 'active' : ''}`}><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>MP Approval / Fund Sanction</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {['Approved', 'In Progress', 'Completed'].includes(trackedRequest.status)
                          ? 'Fund allocated and approved under MPLADS scheme.'
                          : 'Awaiting MP development sanction.'}
                      </p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className={`timeline-badge ${trackedRequest.status === 'Completed' ? 'completed' : trackedRequest.status === 'In Progress' ? 'active' : ''}`}><CheckCircle size={14} /></div>
                    <div className="timeline-content">
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Execution & Verification</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {trackedRequest.status === 'Completed'
                          ? 'Work completed and verified by site inspection.'
                          : trackedRequest.status === 'In Progress'
                          ? 'Tender awarded. Work in progress on ground.'
                          : 'Awaiting scheduling.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Please enter a valid request ID to track.
              </div>
            )}
          </div>

          {/* Consensus Voting Right */}
          <div className="glass-card">
            <h2 className="glass-card-title">
              <ThumbsUp size={20} className="text-cyan" /> Community Consensus Layer
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Vote on proposals in your area. AI priority updates dynamically to reflect local consensus density.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
              {requests.map(req => (
                <div key={req.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{req.id} | {villages.find(v => v.id === req.locationId)?.name}</span>
                    <span>{req.category}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{req.subCategory}</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    "{req.translatedText}"
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem' }}>
                    <button 
                      onClick={() => onVoteRequest(req.id, 'support')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                    >
                      <ThumbsUp size={12} /> Support ({req.supportVotes})
                    </button>
                    <button 
                      onClick={() => onVoteRequest(req.id, 'oppose')}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                    >
                      <ThumbsDown size={12} /> Concern ({req.opposeVotes})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'bot' && (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="glass-card-title">
            <MessageSquare size={20} className="text-cyan" /> WhatsApp Bot Simulator
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Simulate a WhatsApp conversation with LokNiti AI. You can submit local details or query statuses.
          </p>

          <div className="chat-window">
            <div className="chat-messages">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            
            <div className="chat-input-area">
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Type message... (e.g. status, report, hi)" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                <Send size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '100%' }}>Quick suggestions:</span>
            <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => {setChatInput('report');}}>
              Report Grievance
            </button>
            <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => {setChatInput('status req-001');}}>
              Track REQ-001
            </button>
            <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => {setChatInput('Panchpara village');}}>
              Panchpara village
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
