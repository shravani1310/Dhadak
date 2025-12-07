import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Mail, MapPin, Phone, Trophy, Calendar, Users } from 'lucide-react';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [aboutContent, setAboutContent] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [gallery, achievs, team, work, about] = await Promise.all([
        fetch(`${API_URL}/api/gallery`).then(r => r.json()),
        fetch(`${API_URL}/api/achievements`).then(r => r.json()),
        fetch(`${API_URL}/api/team`).then(r => r.json()),
        fetch(`${API_URL}/api/workshop`).then(r => r.json()),
        fetch(`${API_URL}/api/about`).then(r => r.json()),
      ]);
      setGalleryPhotos(gallery);
      setAchievements(achievs);
      setTeamMembers(team);
      setWorkshops(work);
      setAboutContent(about.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (response.ok) {
        toast.success('Message sent successfully!');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1679640933527-c96c91df0e46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxlbmVyZ2V0aWMlMjBkYW5jZSUyMGNyZXclMjBwZXJmb3JtYW5jZSUyMHN0YWdlJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzY1MDgzNjY2fDA&ixlib=rb-4.1.0&q=85"
            alt="Dhadak Dance Crew"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Spotlight Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-heading font-black mb-6"
            style={{
              background: 'linear-gradient(to right, #F43F5E, #6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            DHADAK
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-xl md:text-3xl font-body text-foreground mb-8"
          >
            The Official Dance Committee
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto"
          >
            Where rhythm meets culture, and passion meets performance. Join us in celebrating the art of dance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
              Get in Touch
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About Us
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {aboutContent || 'Dhadak is the official dance committee of our college. We are a vibrant community of dancers passionate about various dance forms and cultural expression.'}
              </p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <Card hover>
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-3xl font-bold text-foreground">{teamMembers.length}+</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </CardContent>
                </Card>
                <Card hover>
                  <CardContent className="p-6 text-center">
                    <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <p className="text-3xl font-bold text-foreground">{achievements.length}+</p>
                    <p className="text-sm text-muted-foreground">Awards</p>
                  </CardContent>
                </Card>
                <Card hover>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
                    <p className="text-3xl font-bold text-foreground">{workshops.length}+</p>
                    <p className="text-sm text-muted-foreground">Events</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1698303098477-fac2428d9dfe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxlbmVyZ2V0aWMlMjBkYW5jZSUyMGNyZXclMjBwZXJmb3JtYW5jZSUyMHN0YWdlJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzY1MDgzNjY2fDA&ixlib=rb-4.1.0&q=85"
                alt="Team"
                className="rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Gallery
            </h2>
            <p className="text-lg text-muted-foreground">Moments captured from our performances and events</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryPhotos.slice(0, 6).map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || 'Gallery'}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium">{photo.caption}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Achievements
            </h2>
            <p className="text-lg text-muted-foreground">Celebrating our victories and milestones</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/20 p-3 rounded-full">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-heading font-bold mb-2">{achievement.title}</h3>
                        <p className="text-muted-foreground mb-3">{achievement.description}</p>
                        <p className="text-sm text-primary">{achievement.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Section */}
      <section id="workshop" className="py-32 px-4 bg-muted/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <img
            src="https://images.unsplash.com/photo-1757346143598-d1f97a47050d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxjb250ZW1wb3JhcnklMjBkYW5jZSUyMHdvcmtzaG9wJTIwc3R1ZGVudHMlMjBzdHVkaW98ZW58MHx8fHwxNzY1MDgzNjY5fDA&ixlib=rb-4.1.0&q=85"
            alt="Workshop"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Annual Workshop
            </h2>
            <p className="text-lg text-muted-foreground">Join us for an unforgettable learning experience</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workshops.filter(w => w.is_active).map((workshop, index) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <CardHeader>
                    <CardTitle>{workshop.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{workshop.description}</p>
                    <div className="flex items-center gap-2 text-sm text-primary mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{workshop.date}</span>
                    </div>
                    {workshop.registration_link && (
                      <Button
                        onClick={() => window.open(workshop.registration_link, '_blank')}
                        className="w-full"
                      >
                        Register Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground">The talented individuals behind Dhadak</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card hover className="h-full">
                  <CardContent className="p-0">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-64 object-cover rounded-t-xl"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-heading font-bold mb-1">{member.name}</h3>
                      <p className="text-primary text-sm mb-4">{member.role}</p>
                      <div className="flex gap-3">
                        {member.instagram && (
                          <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {member.twitter && (
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground">Have questions? We'd love to hear from you</p>
          </motion.div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <Input
                  label="Name"
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
                <Textarea
                  label="Message"
                  placeholder="Your message..."
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DHADAK
          </h3>
          <p className="text-muted-foreground mb-6">The Official Dance Committee</p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dhadak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
