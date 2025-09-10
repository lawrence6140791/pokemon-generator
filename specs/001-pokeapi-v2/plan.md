# Implementation Plan: 寶可夢隨機卡片生成器

**Branch**: `001-pokeapi-v2` | **Date**: 2025-09-10 | **Spec**: `/home/utrust/pokemon-generator/specs/001-pokeapi-v2/spec.md`
**Input**: Feature specification from `/specs/001-pokeapi-v2/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
使用者在單頁前端介面點擊寶貝球以隨機抓取一隻寶可夢並顯示可翻轉的資訊卡片。卡片正面顯示圖像、語系敏感名稱、屬性與編號；背面顯示描述與動圖。失敗時顯示訊息並自動重試一次。研究確立：純前端 SPA、兩個 PokeAPI 端點並行呼叫、語系與圖片多層 fallback、無離線支援、單一卡覆蓋。

## Technical Context
**Language/Version**: HTML5, CSS3, JavaScript (ES6+)
**Primary Dependencies**: Bootstrap 5, jQuery (DOM 操作與快速事件綁定)
**Storage**: N/A（無持久化）
**Testing**: （初期）手動 + quickstart；後續建議：Jest/Vitest（單元解析）、Playwright（E2E）
**Target Platform**: 現代桌面/行動瀏覽器 (Chrome/Firefox/Safari/Edge 最新 2 版本)
**Project Type**: single (pure frontend)
**Performance Goals**: 初次抽取感知 <1.5s；翻轉動畫 0.5s 平滑；無明顯 layout shift
**Constraints**: 最小視窗 390x844；無離線；單請求進行控制
**Scale/Scope**: 單螢幕互動，單一核心組件（卡片）+

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 1 (前端 SPA)
- Using framework directly? YES（直接使用 Bootstrap/jQuery）
- Single data model? YES（Pokemon + transient DrawInteraction）
- Avoiding patterns? YES（無 Repository/UoW）

**Architecture**:
- Library model n/a（前端功能模組化在單一程式檔案內）
- No backend / no CLI
- Docs: spec + research + plan + data-model + quickstart + contracts 完整

**Testing (NON-NEGOTIABLE)**:
- 初期以 quickstart 驗收 + 可擴充測試 TODO
- 後續 tasks 將加入：資料解析純函式單元測試優先，再 UI 行為（E2E）
- 無外部 DB；直接調用真實 API（可加速時 stub）
- 原則：新增測試檔 → 驗證失敗 → 再實作

**Observability**:
- Console 分級輸出：info（抽取開始/成功/失敗）、warn（fallback 使用）、error（第二次失敗）
- 無後端集中串流需求
- 錯誤訊息採用統一使用者友善字串

**Versioning**:
- 初始預設 0.1.0（於 tasks 中加入版本標記檔案建議）
- Breaking 無關：單一互動元件

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 1（Single project）

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md (已完成，無未解事項)

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh [claude|gemini|copilot]` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/frontend-contract.md, quickstart.md（測試檔將於後續 tasks 階段建立）

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy (Adjusted for Pure Frontend)**:
- 基底仍使用 `/templates/tasks-template.md` 規則，但無伺服器端點。
- Contracts 代表：`frontend-contract.md` 中的資料解析與 API 呼叫契約 → 產生「解析函式 contract 測試」。
- Entities：`Pokemon`, `DrawInteraction` → 產生 model/utility JS 檔建立任務。
- User Stories / Acceptance Scenarios → 產生互動 (integration/E2E) 測試占位檔。
- Edge Cases → 產生額外行為測試（重試、重抽、fallback）。
- Quickstart → 產生驗收腳本檔（docs 或 markdown 驗收清單同步）。

**Planned Categories**:
1. Setup：建 `src/`、`tests/`、佔位 README、版本檔。
2. Contract Tests：資料解析與合併邏輯（模擬 fetch JSON）。
3. Model & Utility：`pokemonFactory.js`, `apiClient.js`, `state.js`。
4. Core UI：主入口 `index.html`、樣式、卡片 component、抽卡控制、翻轉動畫。
5. Interaction Tests：點擊抽卡、翻轉、錯誤重試、避免連續同 ID。
6. Edge/Polish：背景色映射、載入延遲、fallback 圖、名稱/敘述語系。
7. Documentation & Version：更新 quickstart、CHANGELOG/版本檔。

**Ordering Strategy**:
1. Setup → 2. Contract Tests (FAIL first) → 3. Models/Utilities → 4. UI 基礎骨架 → 5. 行為整合 → 6. Edge Cases → 7. Polish/Docs。

**Parallelization Rule**:
- 不同檔案可標 [P]（例如 tests/unit/* 與 src/ui/*）。
- 同一 UI 檔案演進不標 [P]（避免衝突）。

**Estimated Output**: 18-24 tasks（輕量單頁）。

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented (none needed)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*