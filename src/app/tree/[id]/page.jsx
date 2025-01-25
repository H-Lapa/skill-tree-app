'use client';
import { useParams } from 'next/navigation';
import TreeVisualiser from '@/components/SkillTree/TreeVisualiser';

export default function TreePage() {
  const { id } = useParams();
  
  return (
    <div>
      <TreeVisualiser treeId={id} />
    </div>
  );
}