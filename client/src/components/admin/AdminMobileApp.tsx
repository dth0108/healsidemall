import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  QrCode, 
  Download,
  ArrowRightLeft,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';

interface AppInfo {
  version: string;
  lastSync: string;
  apiKey: string;
  syncEnabled: boolean;
  connectionStatus: 'connected' | 'disconnected';
}

export default function AdminMobileApp() {
  const { toast } = useToast();
  const [qrVisible, setQrVisible] = useState(false);

  // 모바일 앱 정보 가져오기
  const { data: appInfo, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/mobile/app-info'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/admin/mobile/app-info');
        return response.json() as Promise<AppInfo>;
      } catch (error) {
        console.error('앱 정보를 가져오는 중 오류 발생:', error);
        return {
          version: '1.0.0',
          lastSync: '동기화 없음',
          apiKey: '생성 필요',
          syncEnabled: false,
          connectionStatus: 'disconnected'
        } as AppInfo;
      }
    }
  });

  // API 키 생성
  const generateApiKey = async () => {
    try {
      const response = await apiRequest('POST', '/api/admin/mobile/api-key');
      const data = await response.json();
      
      toast({
        title: 'API 키 생성 성공',
        description: '새로운 API 키가 생성되었습니다.',
      });
      
      refetch();
    } catch (error) {
      toast({
        title: 'API 키 생성 실패',
        description: 'API 키 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  // 동기화 설정 토글
  const toggleSync = async () => {
    try {
      const response = await apiRequest('POST', '/api/admin/mobile/toggle-sync', {
        enabled: !appInfo?.syncEnabled
      });
      
      toast({
        title: '동기화 설정 변경됨',
        description: `동기화가 ${!appInfo?.syncEnabled ? '활성화' : '비활성화'}되었습니다.`,
      });
      
      refetch();
    } catch (error) {
      toast({
        title: '동기화 설정 변경 실패',
        description: '설정 변경 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  // 앱 다운로드 안내
  const downloadApp = () => {
    // 실제 구현에서는 앱 스토어 링크나 APK 다운로드 링크를 제공해야 합니다.
    toast({
      title: '앱 다운로드',
      description: '앱 스토어에서 Healside 앱을 검색하세요.',
    });
  };

  // 동기화 상태 표시
  const getSyncStatus = () => {
    if (!appInfo) return '정보 없음';
    
    return appInfo.syncEnabled ? (
      <span className="text-green-500 flex items-center">
        활성화됨 <ShieldCheck className="ml-1 h-4 w-4" />
      </span>
    ) : (
      <span className="text-gray-500">비활성화됨</span>
    );
  };

  // 연결 상태 표시
  const getConnectionStatus = () => {
    if (!appInfo) return '정보 없음';
    
    return appInfo.connectionStatus === 'connected' ? (
      <span className="text-green-500 flex items-center">
        연결됨 <ArrowRightLeft className="ml-1 h-4 w-4" />
      </span>
    ) : (
      <span className="text-red-500">연결 끊김</span>
    );
  };

  if (isLoading) {
    return <div className="py-4">모바일 앱 정보를 불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">모바일 앱 관리</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5" />
              Flutter Flow 모바일 앱
            </CardTitle>
            <CardDescription>
              제품 여행 중에도 웹사이트에 새 제품을 업로드하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">앱 버전</span>
              <span className="font-medium">{appInfo?.version || '정보 없음'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">마지막 동기화</span>
              <span className="font-medium">{appInfo?.lastSync || '동기화 없음'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">자동 동기화</span>
              <span className="font-medium">{getSyncStatus()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">연결 상태</span>
              <span className="font-medium">{getConnectionStatus()}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              새로고침
            </Button>
            <Button variant={appInfo?.syncEnabled ? "destructive" : "default"} onClick={toggleSync}>
              {appInfo?.syncEnabled ? '동기화 비활성화' : '동기화 활성화'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="mr-2 h-5 w-5" />
              앱 연결
            </CardTitle>
            <CardDescription>
              모바일 앱을 웹사이트에 연결하여 데이터 동기화
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">API 키</span>
              <span className="font-medium">{appInfo?.apiKey ? '••••••••' : '생성 필요'}</span>
            </div>
            
            {qrVisible && (
              <div className="flex justify-center py-4">
                <div className="border p-2 rounded bg-white">
                  <QRCodeSVG 
                    value={JSON.stringify({
                      apiUrl: window.location.origin + '/api',
                      apiKey: appInfo?.apiKey || ''
                    })} 
                    size={150}
                    level="H"
                  />
                </div>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              {qrVisible ? 
                '모바일 앱에서 이 QR 코드를 스캔하여 웹사이트에 연결하세요' : 
                'QR 코드를 표시하려면 아래 버튼을 클릭하세요'}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setQrVisible(!qrVisible)}>
              {qrVisible ? '코드 숨기기' : 'QR 코드 표시'}
            </Button>
            <Button onClick={generateApiKey}>
              새 API 키 생성
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>모바일 앱 다운로드</CardTitle>
          <CardDescription>
            제품 관리를 위한 Healside 앱을 다운로드하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="mb-4">iOS 및 Android 앱 스토어에서 Healside 앱을 다운로드할 수 있습니다.</p>
            <p className="text-sm text-muted-foreground">
              앱에서 QR 코드를 스캔하여 이 웹사이트에 연결하세요.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={downloadApp}>
            <Download className="mr-2 h-4 w-4" />
            앱 다운로드
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}