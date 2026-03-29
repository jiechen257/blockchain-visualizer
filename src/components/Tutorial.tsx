interface TutorialProps {
  onComplete?: () => void;
}

// 教学职责已迁移到实验室左侧任务面板，这里保留空兼容层避免旧引用报错。
export default function Tutorial(props: TutorialProps) {
  void props
  return null;
}
