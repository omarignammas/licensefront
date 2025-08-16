import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardFooter,
  HlmCardHeader,
  HlmCardTitle,
} from '@spartan-ng/helm/card';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTabs, HlmTabsContent, HlmTabsList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';

@Component({
  selector: 'spartan-tabs-preview',
  standalone: true, // ✅ required when importing standalone components
  imports: [
    HlmTabs,
    HlmTabsList,
    HlmTabsTrigger,
    HlmTabsContent,
    HlmCardContent,
    HlmCardDescription,
    HlmCard,
    HlmCardFooter,
    HlmCardHeader,
    HlmCardTitle,
    HlmLabel,
    HlmInput,
    HlmButton,
  ],
  templateUrl: './tabs-preview.component.html',
  host: {
    class: 'block w-full max-w-lg',
  },
})
export class TabsPreview {}
