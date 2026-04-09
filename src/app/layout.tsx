import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "무니에게 알려줘",
    template: "%s | 무니에게 알려줘",
  },
  description: "달에서 온 아기 토끼 무니에게 오늘 배운 개념을 설명해보세요. 가르치면서 진짜 실력이 쌓이는 AI 학습 앱. 선생님께는 학생별 이해도 리포트를 자동으로 제공해요.",
  keywords: ["AI 학습", "프로테제 효과", "초등 교육", "무니", "학습 앱", "이해도 리포트"],
  openGraph: {
    title: "무니에게 알려줘",
    description: "달에서 온 아기 토끼 무니에게 설명하면서 진짜 실력이 쌓여요",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
