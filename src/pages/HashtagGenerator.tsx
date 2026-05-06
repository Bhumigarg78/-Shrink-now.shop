import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, RefreshCw, Smartphone, Globe, Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SEO from '../components/SEO';

const HashtagGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState('instagram');
  const [quantity, setQuantity] = useState(20);

  const hashtagData: { [key: string]: string[] } = {
    nature: ['#nature', '#photography', '#naturephotography', '#travel', '#landscape', '#photooftheday', '#beautiful', '#picoftheday', '#ig', '#naturelovers', '#outdoor', '#adventure', '#explore', '#green', '#wildlife', '#forest', '#mountains', '#sky', '#sun', '#flowers'],
    fitness: ['#fitness', '#gym', '#workout', '#motivation', '#fit', '#bodybuilding', '#training', '#health', '#lifestyle', '#instagood', '#fitnessmotivation', '#healthy', '#crossfit', '#gymlife', '#personaltrainer', '#exercise', '#muscle', '#abs', '#yoga', '#cardio'],
    tech: ['#tech', '#technology', '#innovation', '#coding', '#programming', '#software', '#future', '#gadgets', '#digital', '#developer', '#startup', '#engineering', '#ai', '#robotics', '#cybersecurity', '#codinglife', '#webdesign', '#it', '#apple', '#android'],
    business: ['#business', '#entrepreneur', '#success', '#marketing', '#motivation', '#money', '#growth', '#startup', '#smallbusiness', '#mindset', '#leadership', '#digitalmarketing', '#goals', '#investment', '#strategy', '#entrepreneurship', '#work', '#startupquotes', '#wealth', '#ecommerce'],
    travel: ['#travel', '#nature', '#travelphotography', '#photography', '#love', '#photooftheday', '#instatravel', '#travelgram', '#wanderlust', '#picoftheday', '#adventure', '#art', '#trip', '#landscape', '#explore', '#vacation', '#tourist', '#beach', '#sunset', '#holiday'],
    food: ['#food', '#foodporn', '#foodie', '#instafood', '#foodphotography', '#yummy', '#delicious', '#foodstagram', '#foodblogger', '#love', '#instagood', '#healthyfood', '#homemade', '#dinner', '#foodlover', '#cooking', '#breakfast', '#lunch', '#dessert', '#chef'],
    gaming: ['#gaming', '#gamer', '#ps5', '#xbox', '#pcgaming', '#videogames', '#twitch', '#streamer', '#gamingcommunity', '#esports', '#nintendo', '#fortnite', '#cod', '#minecraft', '#gameplay', '#gamingsetup', '#valorant', '#apexlegends', '#retro', '#gamers'],
    fashion: ['#fashion', '#style', '#ootd', '#love', '#instagood', '#model', '#photooftheday', '#photography', '#beautiful', '#beauty', '#fashionblogger', '#dress', '#instadaily', '#outfit', '#shopping', '#lifestyle', '#design', '#fashionstyle', '#girl', '#picoftheday'],
    education: ['#education', '#learning', '#school', '#students', '#knowledge', '#study', '#motivation', '#teacher', '#science', '#college', '#university', '#success', '#kids', '#learn', '#mindset', '#educational', '#training', '#coaching', '#onlinelearning', '#teaching'],
    art: ['#art', '#artist', '#drawing', '#artwork', '#illustration', '#painting', '#digitalart', '#design', '#sketch', '#love', '#instagood', '#creative', '#photography', '#arte', '#draw', '#instaart', '#sketchbook', '#contemporaryart', '#gallery', '#abstractart']
  };

  const platformTags: { [key: string]: string[] } = {
    instagram: ['#explorepage', '#reels', '#instadaily', '#trendingreels', '#igdaily'],
    tiktok: ['#fyp', '#foryou', '#viral', '#tiktokindia', '#trendingtiktok', '#challenge'],
    linkedin: ['#professional', '#networking', '#growth', '#careers', '#thoughtleadership'],
    youtube: ['#shorts', '#subscribe', '#contentcreator', '#youtubeshorts', '#vlog']
  };

  const generateHashtags = () => {
    if (!topic) return;
    setLoading(true);
    
    setTimeout(() => {
      const lowerTopic = topic.toLowerCase();
      let results: string[] = [];
      
      // Multi-category match
      Object.keys(hashtagData).forEach(key => {
        if (lowerTopic.includes(key)) {
          results = [...results, ...hashtagData[key]];
        }
      });

      // AI-like generation for specific words if no broad category matches
      if (results.length === 0) {
        const base = topic.replace(/\s+/g, '');
        results = [
          `#${base}`, `#${base}life`, `#${base}gram`, `#${base}world`, `#${base}style`,
          `#${base}photography`, `#love${base}`, `#best${base}`, `#top${base}`, `#${base}oftheday`,
          `#${base}lovers`, `#${base}daily`, `#${base}community`, `#explore${base}`, `#${base}time`
        ];
      }

      // Add platform specific tags
      if (platformTags[platform]) {
        results = [...results, ...platformTags[platform]];
      }

      // General viral tags
      results = [...results, '#viral', '#trending', '#explore', '#bestoftheday', '#popular'];

      // Shuffle and take requested quantity
      const finalTags = [...new Set(results)]
        .sort(() => Math.random() - 0.5)
        .slice(0, quantity);
      
      setHashtags(finalTags);
      setLoading(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    const text = hashtags.join(' ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Hashtags copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <SEO 
        title="AI Hashtag Generator" 
        description="Generate viral hashtags for Instagram, TikTok, and Twitter instantly with our AI-powered hashtag generator."
      />
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'left', marginBottom: '30px' }}
      >
        <a href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.9rem', padding: '8px 16px', borderRadius: '12px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)' }}>
          &larr; Back to Home
        </a>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass" 
        style={{ padding: '40px' }}
      >
        <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '30px' }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem' }}>
              <Globe size={14} /> Topic / Keywords
            </label>
            <input 
              type="text" 
              placeholder="e.g. Hiking, Coding..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateHashtags()}
              style={{ width: '100%', padding: '12px 15px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem' }}>
              <Smartphone size={14} /> Platform
            </label>
            <select 
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={{ width: '100%', padding: '12px 15px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube Shorts</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem' }}>
              <Layers size={14} /> Quantity
            </label>
            <select 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              style={{ width: '100%', padding: '12px 15px', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="10">Few (10)</option>
              <option value="20">Medium (20)</option>
              <option value="30">Many (30)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={generateHashtags}
          disabled={loading || !topic}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1.1rem' }}
        >
          {loading ? <><RefreshCw className="animate-spin" size={20} /> Generating tags...</> : <><Sparkles size={20} /> Generate Hashtags</>}
        </button>

        {hashtags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '40px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Results for "{topic}" ({platform})</h3>
              <button 
                onClick={copyToClipboard}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}
              >
                {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy All'}
              </button>
            </div>

            <div className="glass" style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {hashtags.map((tag, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
                  onClick={() => { navigator.clipboard.writeText(tag); toast.success(`${tag} copied!`); }}
                  style={{ 
                    color: '#a855f7', 
                    background: 'rgba(168, 85, 247, 0.1)', 
                    padding: '8px 15px', 
                    borderRadius: '10px', 
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: '1px solid rgba(168, 85, 247, 0.2)'
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default HashtagGenerator;

