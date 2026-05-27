import StudyPlanContent from './StudyPlanContent.jsx';

export default function StudyPlan({ autoplan, userProfile, onStart }) {
  const planSummary = autoplan?.status === 'done' ? autoplan.text : null;
  return (
    <StudyPlanContent
      userProfile={userProfile}
      onStart={onStart}
      planSummary={planSummary}
    />
  );
}
