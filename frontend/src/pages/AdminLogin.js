import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/admin/login' : '/api/admin/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.email);
        toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(data.detail || 'Authentication failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DHADAK
          </h1>
          <p className="text-muted-foreground">Admin Portal</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">
              {isLogin ? 'Admin Login' : 'Create Admin Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-center"
              >
                ← Back to Website
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
