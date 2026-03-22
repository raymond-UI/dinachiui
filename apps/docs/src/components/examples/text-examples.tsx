"use client"

import { Text } from '@/components/ui/text';

export function DefaultTextExample() {
  return (
    <Text>
      The quick brown fox jumps over the lazy dog. This is a default paragraph
      rendered as a {'<p>'} element with comfortable leading.
    </Text>
  );
}

export function TextVariantsExample() {
  return (
    <div className="space-y-4">
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="p">Paragraph — the default variant with comfortable line height.</Text>
      <Text variant="lead">Lead text for introductory paragraphs.</Text>
      <Text variant="muted">Muted text for secondary information and descriptions.</Text>
      <Text variant="span">Inline span text for use within other elements.</Text>
    </div>
  );
}

export function TextAsOverrideExample() {
  return (
    <div className="space-y-4">
      <Text variant="h2" as="h3">
        Styled as h2, rendered as {'<h3>'}
      </Text>
      <Text variant="muted" as="span">
        Styled as muted, rendered as {'<span>'} instead of {'<p>'}
      </Text>
    </div>
  );
}
