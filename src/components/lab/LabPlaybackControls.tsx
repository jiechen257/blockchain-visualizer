import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import useBlockchainStore from '@/store/useBlockchainStore'

export default function LabPlaybackControls() {
  const {
    guideStep,
    isPlaybackRunning,
    setPlaybackRunning,
    advanceGuideStep,
    rewindGuideStep,
    explanationLevel,
    setExplanationLevel,
  } = useBlockchainStore((state) => ({
    guideStep: state.guideStep,
    isPlaybackRunning: state.isPlaybackRunning,
    setPlaybackRunning: state.setPlaybackRunning,
    advanceGuideStep: state.advanceGuideStep,
    rewindGuideStep: state.rewindGuideStep,
    explanationLevel: state.explanationLevel,
    setExplanationLevel: state.setExplanationLevel,
  }))

  useEffect(() => {
    if (!isPlaybackRunning) {
      return;
    }

    if (guideStep === 'confirmed') {
      setPlaybackRunning(false);
      return;
    }

    const timer = window.setTimeout(() => {
      advanceGuideStep();
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [advanceGuideStep, guideStep, isPlaybackRunning, setPlaybackRunning]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={() => setPlaybackRunning(!isPlaybackRunning)}
      >
        {isPlaybackRunning ? '暂停演示' : '播放演示'}
      </Button>
      <Button size="sm" variant="outline" onClick={advanceGuideStep}>
        单步前进
      </Button>
      <Button size="sm" variant="outline" onClick={rewindGuideStep}>
        回看上一状态
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          setExplanationLevel(explanationLevel === 'basic' ? 'deep' : 'basic')
        }
      >
        {explanationLevel === 'basic' ? '深入解释' : '基础解释'}
      </Button>
    </div>
  )
}
