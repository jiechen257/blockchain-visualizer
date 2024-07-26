// src/components/Tutorial.tsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tutorialSteps = [
  {
    title: "欢迎",
    content: "欢迎来到区块链可视化系统！这个教程将帮助你了解系统的各个部分。",
  },
  {
    title: "钱包",
    content: "钱包用于存储和管理你的加密货币。你可以创建新钱包，查看余额和交易历史。",
  },
  {
    title: "交易",
    content: "交易允许你将加密货币从一个钱包发送到另一个钱包。所有交易都会被记录在区块链上。",
  },
  {
    title: "挖矿",
    content: "挖矿是将新交易添加到区块链的过程。矿工通过解决复杂的数学问题来竞争添加新区块的权利。",
  },
  {
    title: "区块链",
    content: "区块链是一个分布式账本，记录了所有的交易。每个区块都包含多个交易，并链接到前一个区块。",
  },
  {
    title: "分叉",
    content: "分叉发生在区块链出现两个或多个竞争版本时。最长的链通常被认为是有效的。",
  },
];

const Tutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块链教程</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">{tutorialSteps[currentStep].title}</h3>
        <p className="mb-4">{tutorialSteps[currentStep].content}</p>
        <div className="flex justify-between">
          <Button onClick={prevStep} disabled={currentStep === 0}>上一步</Button>
          <Button onClick={nextStep} disabled={currentStep === tutorialSteps.length - 1}>下一步</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Tutorial;