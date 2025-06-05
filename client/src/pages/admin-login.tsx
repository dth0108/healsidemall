import React, { useState, useContext } from 'react';
import { useLocation } from 'wouter';
import { AuthContext } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { login } = useContext(AuthContext);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/admin/login', formData);
      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        toast({
          title: "로그인 성공",
          description: "관리자 대시보드로 이동합니다.",
        });
        // Force page reload to ensure auth state is properly updated
        setTimeout(() => {
          window.location.href = '/admin';
        }, 500);
      } else {
        toast({
          title: "로그인 실패",
          description: data.message || "사용자명 또는 비밀번호가 잘못되었습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>관리자 로그인</CardTitle>
          <CardDescription>
            Healside 관리자 계정으로 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">사용자명</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="관리자 사용자명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            <p>테스트 계정:</p>
            <p>사용자명: admin</p>
            <p>비밀번호: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}