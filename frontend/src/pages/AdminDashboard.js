import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { toast } from 'sonner';
import { 
  LogOut, Image, Trophy, Users, Calendar, Info, Mail, Plus, Trash2, Edit, X 
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const { token, email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'workshop', label: 'Workshop', icon: Calendar },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DHADAK Admin
            </h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              View Website
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'gallery' && <GalleryTab token={token} />}
            {activeTab === 'achievements' && <AchievementsTab token={token} />}
            {activeTab === 'team' && <TeamTab token={token} />}
            {activeTab === 'workshop' && <WorkshopTab token={token} />}
            {activeTab === 'about' && <AboutTab token={token} />}
            {activeTab === 'contact' && <ContactTab token={token} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Gallery Tab Component
const GalleryTab = ({ token }) => {
  const [photos, setPhotos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ image_url: '', caption: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery`);
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      toast.error('Error fetching photos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('Photo added successfully');
        setFormData({ image_url: '', caption: '' });
        setShowForm(false);
        fetchPhotos();
      } else {
        toast.error('Failed to add photo');
      }
    } catch (error) {
      toast.error('Error adding photo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    try {
      const response = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Photo deleted');
        fetchPhotos();
      } else {
        toast.error('Failed to delete photo');
      }
    } catch (error) {
      toast.error('Error deleting photo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading font-bold">Gallery Management</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Photo'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
              />
              <Input
                label="Caption (optional)"
                placeholder="Photo caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Photo'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card key={photo.id} hover>
            <CardContent className="p-0">
              <img src={photo.image_url} alt={photo.caption} className="w-full h-48 object-cover rounded-t-xl" />
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-3">{photo.caption || 'No caption'}</p>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(photo.id)} className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Achievements Tab Component
const AchievementsTab = ({ token }) => {
  const [achievements, setAchievements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image_url: '', date: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_URL}/api/achievements`);
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      toast.error('Error fetching achievements');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId
        ? `${API_URL}/api/achievements/${editingId}`
        : `${API_URL}/api/achievements`;
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success(editingId ? 'Achievement updated' : 'Achievement added');
        setFormData({ title: '', description: '', image_url: '', date: '' });
        setShowForm(false);
        setEditingId(null);
        fetchAchievements();
      } else {
        toast.error('Failed to save achievement');
      }
    } catch (error) {
      toast.error('Error saving achievement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (achievement) => {
    setFormData({
      title: achievement.title,
      description: achievement.description,
      image_url: achievement.image_url || '',
      date: achievement.date,
    });
    setEditingId(achievement.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;
    try {
      const response = await fetch(`${API_URL}/api/achievements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Achievement deleted');
        fetchAchievements();
      } else {
        toast.error('Failed to delete achievement');
      }
    } catch (error) {
      toast.error('Error deleting achievement');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading font-bold">Achievements Management</h2>
        <Button onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            setEditingId(null);
            setFormData({ title: '', description: '', image_url: '', date: '' });
          }
        }}>
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Achievement'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                placeholder="Achievement title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Textarea
                label="Description"
                placeholder="Achievement description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <Input
                label="Image URL (optional)"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
              <Input
                label="Date"
                placeholder="e.g., March 2024"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update Achievement' : 'Add Achievement')}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <Card key={achievement.id} hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold mb-2">{achievement.title}</h3>
                  <p className="text-muted-foreground mb-2">{achievement.description}</p>
                  <p className="text-sm text-primary">{achievement.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(achievement)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(achievement.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Team Tab Component
const TeamTab = ({ token }) => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', role: '', image_url: '', instagram: '', linkedin: '', twitter: '', order: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/team`);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      toast.error('Error fetching team members');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId
        ? `${API_URL}/api/team/${editingId}`
        : `${API_URL}/api/team`;
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success(editingId ? 'Member updated' : 'Member added');
        setFormData({ name: '', role: '', image_url: '', instagram: '', linkedin: '', twitter: '', order: 0 });
        setShowForm(false);
        setEditingId(null);
        fetchMembers();
      } else {
        toast.error('Failed to save member');
      }
    } catch (error) {
      toast.error('Error saving member');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      image_url: member.image_url,
      instagram: member.instagram || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      order: member.order,
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      const response = await fetch(`${API_URL}/api/team/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Member deleted');
        fetchMembers();
      } else {
        toast.error('Failed to delete member');
      }
    } catch (error) {
      toast.error('Error deleting member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading font-bold">Team Management</h2>
        <Button onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            setEditingId(null);
            setFormData({ name: '', role: '', image_url: '', instagram: '', linkedin: '', twitter: '', order: 0 });
          }
        }}>
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Member'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Name"
                  placeholder="Member name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Role"
                  placeholder="e.g., President, Choreographer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Instagram (optional)"
                  placeholder="https://instagram.com/..."
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                />
                <Input
                  label="LinkedIn (optional)"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
                <Input
                  label="Twitter (optional)"
                  placeholder="https://twitter.com/..."
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                />
              </div>
              <Input
                label="Display Order"
                type="number"
                placeholder="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update Member' : 'Add Member')}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member.id} hover>
            <CardContent className="p-0">
              <img src={member.image_url} alt={member.name} className="w-full h-48 object-cover rounded-t-xl" />
              <div className="p-4">
                <h3 className="text-lg font-heading font-bold">{member.name}</h3>
                <p className="text-sm text-primary mb-3">{member.role}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Workshop Tab Component
const WorkshopTab = ({ token }) => {
  const [workshops, setWorkshops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', registration_link: '', image_url: '', is_active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch(`${API_URL}/api/workshop`);
      const data = await response.json();
      setWorkshops(data);
    } catch (error) {
      toast.error('Error fetching workshops');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId
        ? `${API_URL}/api/workshop/${editingId}`
        : `${API_URL}/api/workshop`;
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success(editingId ? 'Workshop updated' : 'Workshop added');
        setFormData({ title: '', description: '', date: '', registration_link: '', image_url: '', is_active: true });
        setShowForm(false);
        setEditingId(null);
        fetchWorkshops();
      } else {
        toast.error('Failed to save workshop');
      }
    } catch (error) {
      toast.error('Error saving workshop');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (workshop) => {
    setFormData({
      title: workshop.title,
      description: workshop.description,
      date: workshop.date,
      registration_link: workshop.registration_link || '',
      image_url: workshop.image_url || '',
      is_active: workshop.is_active,
    });
    setEditingId(workshop.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;
    try {
      const response = await fetch(`${API_URL}/api/workshop/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Workshop deleted');
        fetchWorkshops();
      } else {
        toast.error('Failed to delete workshop');
      }
    } catch (error) {
      toast.error('Error deleting workshop');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading font-bold">Workshop Management</h2>
        <Button onClick={() => {
          setShowForm(!showForm);
          if (showForm) {
            setEditingId(null);
            setFormData({ title: '', description: '', date: '', registration_link: '', image_url: '', is_active: true });
          }
        }}>
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Workshop'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                placeholder="Workshop title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Textarea
                label="Description"
                placeholder="Workshop description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <Input
                label="Date"
                placeholder="e.g., May 15-17, 2024"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Input
                label="Registration Link (optional)"
                placeholder="https://forms.google.com/..."
                value={formData.registration_link}
                onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
              />
              <Input
                label="Image URL (optional)"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm">Active (show on website)</label>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingId ? 'Update Workshop' : 'Add Workshop')}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {workshops.map((workshop) => (
          <Card key={workshop.id} hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-heading font-bold">{workshop.title}</h3>
                    {workshop.is_active && (
                      <span className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">Active</span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">{workshop.description}</p>
                  <p className="text-sm text-primary mb-2">{workshop.date}</p>
                  {workshop.registration_link && (
                    <a href={workshop.registration_link} target="_blank" rel="noopener noreferrer" className="text-sm text-secondary hover:underline">
                      View Registration Link →
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(workshop)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(workshop.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// About Tab Component
const AboutTab = ({ token }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/about`);
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      toast.error('Error fetching about content');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        toast.success('About content updated');
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      toast.error('Error updating content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-heading font-bold">About Content Management</h2>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              label="About Content"
              placeholder="Write about Dhadak..."
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Update Content'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Contact Tab Component
const ContactTab = ({ token }) => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      toast.error('Error fetching contact submissions');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-heading font-bold">Contact Submissions</h2>
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No contact submissions yet
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} hover>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{submission.name}</h3>
                    <p className="text-sm text-muted-foreground">{submission.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-foreground">{submission.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
