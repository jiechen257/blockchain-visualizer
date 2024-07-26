import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tutorialSteps[currentStep].title}</DialogTitle>
          <DialogDescription>
            {tutorialSteps[currentStep].content}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={prevStep} disabled={currentStep === 0}>上一步</Button>
          <Button onClick={nextStep}>
            {currentStep === tutorialSteps.length - 1 ? '完成' : '下一步'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Tutorial;