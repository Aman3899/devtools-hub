# Numbers, Math & Date Tools Implementation (Tools 81-100)

## Context
The goal is to implement 20 new tools belonging to the "Numbers, Math & Date" category for the DevTools Hub platform. This phase will strictly adhere to the established UI/UX patterns (12-column layout), rigorous translation standards (no hardcoded English strings), and comprehensive FAQ integration.

## Core Requirements
1. **Consistent UI Architecture**: Every tool must utilize the `12-column` responsive grid pattern with an input/output section (spanning 9 columns) and a sidebar (spanning 3 columns) for customization, configurations, and information.
2. **Strict Localization (i18n)**: Absolutely no ternary (`isEnglish ? ... : ...`) text logic. All strings must use `t()` or `commonT()` wrappers. Keys and values must be directly implemented within `messages/en.json` and `messages/ur.json`.
3. **Tool Navigation Integration**: The `<ToolNavigation currentToolId="..." />` component must be rendered at the bottom of every tool component.
4. **FAQ Coverage**: Every tool must have a populated `faqs` object in the JSON translation files so the tool page renders helpful Q&As.

## Tools to Build
- [ ] 81. **Timestamp Converter**: Epoch <-> human, timezone selector
- [ ] 82. **Unix Time Now**: Copy current epoch, auto-refresh
- [ ] 83. **Date Difference Calc**: Days, weeks, months, hours between dates
- [ ] 84. **Cron Expression Builder**: Visual picker, next-5-runs preview
- [ ] 85. **Number Base Converter**: Bin/Oct/Dec/Hex instant table
- [ ] 86. **Percentage Calculator**: 3 formula modes, reverse calc
- [ ] 87. **Aspect Ratio Calculator**: Width/height, constrain mode
- [ ] 88. **Byte Size Converter**: KB/MB/GB/TB/PB instant scale
- [ ] 89. **Roman Numeral Converter**: Bidirectional, valid range check
- [ ] 90. **Random Number Generator**: Range, seed, bulk count, no-repeat
- [ ] 91. **Fibonacci Generator**: First N numbers, sum display
- [ ] 92. **Prime Number Checker**: Instant yes/no, next prime button
- [ ] 93. **GCD & LCM Calculator**: Multi-number input, step-by-step
- [ ] 94. **BMI Calculator**: Metric/imperial, category label
- [ ] 95. **Scientific Calculator**: Trig, log, factorial, history
- [ ] 96. **Currency Converter**: Live rates API, multi-pair
- [ ] 97. **Temperature Converter**: C / F / K / R instant convert
- [ ] 98. **Timezone Converter**: Multi-city side-by-side clock
- [ ] 99. **Age Calculator**: DOB input, years/months/days out
- [ ] 100. **Loan EMI Calculator**: Principal/rate/tenure, amortization table

## Execution Plan (Checklist)

### Phase 1: Date & Time Batch (Tools 81-84, 98, 99)
- [ ] Build 81 Timestamp Converter
- [ ] Build 82 Unix Time Now
- [ ] Build 83 Date Difference Calc
- [ ] Build 84 Cron Expression Builder
- [ ] Build 98 Timezone Converter
- [ ] Build 99 Age Calculator
- [ ] Add translation keys + FAQs for these tools.

### Phase 2: Numbers & Math Batch (Tools 85, 86, 89, 90, 91, 92, 93, 95)
- [ ] Build 85 Number Base Converter
- [ ] Build 86 Percentage Calculator
- [ ] Build 89 Roman Numeral Converter
- [ ] Build 90 Random Number Generator
- [ ] Build 91 Fibonacci Generator
- [ ] Build 92 Prime Number Checker
- [ ] Build 93 GCD & LCM Calculator
- [ ] Build 95 Scientific Calculator
- [ ] Add translation keys + FAQs for these tools.

### Phase 3: Converters & Calculators Batch (Tools 87, 88, 94, 96, 97, 100)
- [ ] Build 87 Aspect Ratio Calculator
- [ ] Build 88 Byte Size Converter
- [ ] Build 94 BMI Calculator
- [ ] Build 96 Currency Converter
- [ ] Build 97 Temperature Converter
- [ ] Build 100 Loan EMI Calculator
- [ ] Add translation keys + FAQs for these tools.
