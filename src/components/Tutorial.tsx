import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const tutorialSteps = [
  {
    title: "创建钱包",
    content: "先创建至少一个钱包，后续交易和挖矿都会围绕这个地址展开。",
  },
  {
    title: "发起交易",
    content: "选择发送方和接收方钱包，提交后交易会进入待确认池，等待被区块打包。",
  },
  {
    title: "挖矿确认",
    content: "挖出新区块后，待确认交易会被写入链上，同时奖励地址会收到挖矿奖励。",
  },
  {
    title: "观察主链变化",
    content: "在主链舞台和结构化详情里查看最新区块、分叉状态与关键字段变化。",
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
      <DialogContent className="rounded-[28px] border-slate-200 bg-white/95 shadow-2xl">
        <DialogHeader>
          <DialogTitle>{tutorialSteps[currentStep].title}</DialogTitle>
          <DialogDescription>
            {tutorialSteps[currentStep].content}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={prevStep} disabled={currentStep === 0}>上一步</Button>
          <Button variant="ghost" onClick={onComplete}>稍后再看</Button>
          <Button onClick={nextStep}>
            {currentStep === tutorialSteps.length - 1 ? '完成' : '下一步'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Tutorial;
