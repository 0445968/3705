export default function ReviewStep({ form }: StepProps) {
  return (
    <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
      {JSON.stringify(form, null, 2)}
    </pre>
  );
}