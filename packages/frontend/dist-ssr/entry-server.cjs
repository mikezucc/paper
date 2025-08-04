"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const server_mjs = require("react-router-dom/server.mjs");
const reactRouterDom = require("react-router-dom");
const marked = require("marked");
const Prism = require("prismjs");
require("prismjs/components/prism-javascript.js");
require("prismjs/components/prism-typescript.js");
require("prismjs/components/prism-jsx.js");
require("prismjs/components/prism-tsx.js");
require("prismjs/components/prism-python.js");
require("prismjs/components/prism-java.js");
require("prismjs/components/prism-css.js");
require("prismjs/components/prism-bash.js");
require("prismjs/components/prism-json.js");
require("prismjs/components/prism-markdown.js");
const lodash = require("lodash");
const mammoth = require("mammoth");
const TurndownService = require("turndown");
const config = {
  apiUrl: "http://localhost:4000"
};
class API {
  constructor() {
    this.baseURL = config.apiUrl;
    this.authToken = null;
  }
  setAuth(token) {
    this.authToken = token;
  }
  async request(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers
    };
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    const response = await fetch(`${this.baseURL}/api${path}`, {
      ...options,
      headers
    });
    if (!response.ok) {
      const error2 = await response.json();
      throw new Error(error2.error || "Request failed");
    }
    return response.json();
  }
  get(path) {
    return this.request(path);
  }
  post(path, data) {
    return this.request(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : void 0
    });
  }
  put(path, data) {
    return this.request(path, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
  delete(path) {
    return this.request(path, {
      method: "DELETE"
    });
  }
}
const api = new API();
const AuthContext = React.createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      api.setAuth(sessionId);
      api.get("/auth/me").then(({ user: user2 }) => setUser(user2)).catch(() => localStorage.removeItem("sessionId")).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  const login = (sessionId) => {
    localStorage.setItem("sessionId", sessionId);
    api.setAuth(sessionId);
    api.get("/auth/me").then(({ user: user2 }) => setUser(user2));
  };
  const logout = () => {
    api.post("/auth/logout").finally(() => {
      localStorage.removeItem("sessionId");
      api.setAuth(null);
      setUser(null);
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsx(AuthContext.Provider, { value: { user, loading, login, logout }, children });
}
function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
const container = "_container_1ba1v_1";
const contentContainer = "_contentContainer_1ba1v_7";
const header = "_header_1ba1v_13";
const nav = "_nav_1ba1v_18";
const navLinks = "_navLinks_1ba1v_25";
const logo = "_logo_1ba1v_31";
const paperGrid = "_paperGrid_1ba1v_36";
const paperCard = "_paperCard_1ba1v_43";
const form = "_form_1ba1v_54";
const formGroup = "_formGroup_1ba1v_59";
const label = "_label_1ba1v_63";
const error = "_error_1ba1v_69";
const checkboxLabel = "_checkboxLabel_1ba1v_74";
const checkbox = "_checkbox_1ba1v_74";
const linkButton = "_linkButton_1ba1v_88";
const termsContainer = "_termsContainer_1ba1v_102";
const success = "_success_1ba1v_112";
const hero = "_hero_1ba1v_117";
const features = "_features_1ba1v_122";
const feature = "_feature_1ba1v_122";
const editor = "_editor_1ba1v_137";
const editorPane = "_editorPane_1ba1v_145";
const preview = "_preview_1ba1v_151";
const markdownTextarea = "_markdownTextarea_1ba1v_156";
const fullPageEditor = "_fullPageEditor_1ba1v_175";
const editorHeader = "_editorHeader_1ba1v_186";
const editorHeaderCenter = "_editorHeaderCenter_1ba1v_208";
const editorHeaderLeft = "_editorHeaderLeft_1ba1v_214";
const hidden = "_hidden_1ba1v_221";
const visible = "_visible_1ba1v_226";
const editorHeaderRight = "_editorHeaderRight_1ba1v_238";
const titleInput = "_titleInput_1ba1v_256";
const metadataToggle = "_metadataToggle_1ba1v_270";
const fadeIn = "_fadeIn_1ba1v_1";
const publishButton = "_publishButton_1ba1v_296";
const viewModeToggle = "_viewModeToggle_1ba1v_313";
const toolbarToggle = "_toolbarToggle_1ba1v_336";
const insertToggle = "_insertToggle_1ba1v_355";
const saveButton = "_saveButton_1ba1v_377";
const publishToggle = "_publishToggle_1ba1v_393";
const exitButton = "_exitButton_1ba1v_405";
const metadataPanel = "_metadataPanel_1ba1v_424";
const metadataContent = "_metadataContent_1ba1v_430";
const toolbarPopoverContainer = "_toolbarPopoverContainer_1ba1v_437";
const popoverFadeIn = "_popoverFadeIn_1ba1v_1";
const toolbarPopover = "_toolbarPopover_1ba1v_437";
const toolbarSection = "_toolbarSection_1ba1v_469";
const toolbarSectionTitle = "_toolbarSectionTitle_1ba1v_477";
const toolbarRow = "_toolbarRow_1ba1v_484";
const toolbarDivider = "_toolbarDivider_1ba1v_490";
const fontCategory = "_fontCategory_1ba1v_497";
const fontCategoryTitle = "_fontCategoryTitle_1ba1v_501";
const fontGrid = "_fontGrid_1ba1v_510";
const fontOption = "_fontOption_1ba1v_516";
const selected = "_selected_1ba1v_536";
const insertGrid = "_insertGrid_1ba1v_542";
const insertGridItem = "_insertGridItem_1ba1v_548";
const insertPopoverContainer = "_insertPopoverContainer_1ba1v_566";
const insertPopover = "_insertPopover_1ba1v_566";
const insertPopoverTitle = "_insertPopoverTitle_1ba1v_586";
const contextMenu = "_contextMenu_1ba1v_594";
const contextMenuFadeIn = "_contextMenuFadeIn_1ba1v_1";
const contextMenuTitle = "_contextMenuTitle_1ba1v_615";
const contextMenuItems = "_contextMenuItems_1ba1v_625";
const contextMenuItem = "_contextMenuItem_1ba1v_625";
const contextMenuDivider = "_contextMenuDivider_1ba1v_646";
const publishModalOverlay = "_publishModalOverlay_1ba1v_653";
const publishModal = "_publishModal_1ba1v_653";
const publishModalHeader = "_publishModalHeader_1ba1v_679";
const closePublishButton = "_closePublishButton_1ba1v_694";
const publishModalContent = "_publishModalContent_1ba1v_709";
const publishModalInfo = "_publishModalInfo_1ba1v_716";
const publishModalHint = "_publishModalHint_1ba1v_727";
const publishModalBody = "_publishModalBody_1ba1v_734";
const versionsList = "_versionsList_1ba1v_741";
const versionItem = "_versionItem_1ba1v_748";
const versionRadio = "_versionRadio_1ba1v_769";
const versionDetails = "_versionDetails_1ba1v_779";
const versionTitle = "_versionTitle_1ba1v_783";
const versionDate = "_versionDate_1ba1v_789";
const versionStatus = "_versionStatus_1ba1v_795";
const versionMessage = "_versionMessage_1ba1v_803";
const versionDivider = "_versionDivider_1ba1v_810";
const publishModalActions = "_publishModalActions_1ba1v_819";
const cancelPublishButton = "_cancelPublishButton_1ba1v_828";
const confirmPublishButton = "_confirmPublishButton_1ba1v_844";
const versionPreview = "_versionPreview_1ba1v_866";
const versionPreviewHeader = "_versionPreviewHeader_1ba1v_872";
const versionPreviewContent = "_versionPreviewContent_1ba1v_884";
const loadingPreview = "_loadingPreview_1ba1v_890";
const versionPreviewMeta = "_versionPreviewMeta_1ba1v_899";
const versionPreviewAbstract = "_versionPreviewAbstract_1ba1v_909";
const versionPreviewTags = "_versionPreviewTags_1ba1v_915";
const versionPreviewTag = "_versionPreviewTag_1ba1v_915";
const versionPreviewDivider = "_versionPreviewDivider_1ba1v_929";
const versionPreviewMarkdown = "_versionPreviewMarkdown_1ba1v_935";
const publishedBadge = "_publishedBadge_1ba1v_940";
const successModalOverlay = "_successModalOverlay_1ba1v_950";
const successModal = "_successModal_1ba1v_950";
const scaleIn = "_scaleIn_1ba1v_1";
const successModalContent = "_successModalContent_1ba1v_988";
const successIcon = "_successIcon_1ba1v_995";
const bounce = "_bounce_1ba1v_1";
const successTitle = "_successTitle_1ba1v_1010";
const successMessage = "_successMessage_1ba1v_1017";
const successUrl = "_successUrl_1ba1v_1024";
const successUrlInput = "_successUrlInput_1ba1v_1033";
const copyButton = "_copyButton_1ba1v_1044";
const successActions = "_successActions_1ba1v_1061";
const viewPublishedButton = "_viewPublishedButton_1ba1v_1067";
const continueEditingButton = "_continueEditingButton_1ba1v_1084";
const readingProgress = "_readingProgress_1ba1v_1102";
const paperMeta = "_paperMeta_1ba1v_1114";
const tags = "_tags_1ba1v_1120";
const tag = "_tag_1ba1v_1120";
const sizeControls = "_sizeControls_1ba1v_1134";
const sizeButton = "_sizeButton_1ba1v_1144";
const sizeDisplay = "_sizeDisplay_1ba1v_1168";
const insertButtonContainer = "_insertButtonContainer_1ba1v_1177";
const insertButton = "_insertButton_1ba1v_1177";
const insertMenu = "_insertMenu_1ba1v_1201";
const insertMenuItem = "_insertMenuItem_1ba1v_1216";
const undoButton = "_undoButton_1ba1v_1244";
const redoButton = "_redoButton_1ba1v_1245";
const editorError = "_editorError_1ba1v_1273";
const editorContent = "_editorContent_1ba1v_1280";
const focusedMode = "_focusedMode_1ba1v_1310";
const previewPane = "_previewPane_1ba1v_1328";
const modalOverlay = "_modalOverlay_1ba1v_1485";
const modalContent = "_modalContent_1ba1v_1499";
const modalHeader = "_modalHeader_1ba1v_1511";
const closeButton = "_closeButton_1ba1v_1525";
const modalBody = "_modalBody_1ba1v_1545";
const formRow = "_formRow_1ba1v_1551";
const modalActions = "_modalActions_1ba1v_1557";
const cancelButton = "_cancelButton_1ba1v_1566";
const primaryButton = "_primaryButton_1ba1v_1582";
const previewSection = "_previewSection_1ba1v_1603";
const imagePreview = "_imagePreview_1ba1v_1609";
const insertImageResultHidden = "_insertImageResultHidden_1ba1v_1625";
const uploadButton = "_uploadButton_1ba1v_1630";
const downloadButton = "_downloadButton_1ba1v_1654";
const uploadError = "_uploadError_1ba1v_1673";
const fileUploadModal = "_fileUploadModal_1ba1v_1689";
const uploadArea = "_uploadArea_1ba1v_1701";
const uploadAreaDragging = "_uploadAreaDragging_1ba1v_1715";
const uploadAreaLabel = "_uploadAreaLabel_1ba1v_1721";
const uploadIcon = "_uploadIcon_1ba1v_1728";
const uploadText = "_uploadText_1ba1v_1733";
const uploadHint = "_uploadHint_1ba1v_1740";
const fileInfo = "_fileInfo_1ba1v_1745";
const fileName = "_fileName_1ba1v_1755";
const changeFileButton = "_changeFileButton_1ba1v_1760";
const previewContainer = "_previewContainer_1ba1v_1775";
const previewTitle = "_previewTitle_1ba1v_1782";
const previewContent = "_previewContent_1ba1v_1789";
const previewTruncated = "_previewTruncated_1ba1v_1808";
const saveStatus = "_saveStatus_1ba1v_1819";
const saved = "_saved_1ba1v_1828";
const saving = "_saving_1ba1v_1832";
const pulse = "_pulse_1ba1v_1";
const unsaved = "_unsaved_1ba1v_1841";
const revisionsPanel = "_revisionsPanel_1ba1v_1855";
const revisionsPanelHeader = "_revisionsPanelHeader_1ba1v_1869";
const closePanelButton = "_closePanelButton_1ba1v_1884";
const revisionsList = "_revisionsList_1ba1v_1899";
const loadingRevisions = "_loadingRevisions_1ba1v_1905";
const noRevisions = "_noRevisions_1ba1v_1906";
const revisionItem = "_revisionItem_1ba1v_1912";
const revisionInfo = "_revisionInfo_1ba1v_1925";
const revisionTitle = "_revisionTitle_1ba1v_1929";
const revisionDate = "_revisionDate_1ba1v_1935";
const revisionMessage = "_revisionMessage_1ba1v_1940";
const revisionActions = "_revisionActions_1ba1v_1947";
const viewButton = "_viewButton_1ba1v_1952";
const restoreButton = "_restoreButton_1ba1v_1953";
const revisionPreviewOverlay = "_revisionPreviewOverlay_1ba1v_1988";
const revisionPreviewModal = "_revisionPreviewModal_1ba1v_2002";
const revisionPreviewHeader = "_revisionPreviewHeader_1ba1v_2014";
const revisionPreviewDate = "_revisionPreviewDate_1ba1v_2029";
const closePreviewButton = "_closePreviewButton_1ba1v_2035";
const revisionPreviewContent = "_revisionPreviewContent_1ba1v_2050";
const revisionPreviewMetadata = "_revisionPreviewMetadata_1ba1v_2056";
const revisionPreviewSection = "_revisionPreviewSection_1ba1v_2060";
const revisionPreviewTags = "_revisionPreviewTags_1ba1v_2078";
const revisionPreviewTag = "_revisionPreviewTag_1ba1v_2078";
const revisionPreviewDivider = "_revisionPreviewDivider_1ba1v_2092";
const revisionPreviewMarkdown = "_revisionPreviewMarkdown_1ba1v_2098";
const replaceExistingOption = "_replaceExistingOption_1ba1v_2120";
const replaceExistingHint = "_replaceExistingHint_1ba1v_2143";
const dashboardContainer = "_dashboardContainer_1ba1v_2176";
const dashboardHeader = "_dashboardHeader_1ba1v_2181";
const dashboardActions = "_dashboardActions_1ba1v_2196";
const newPaperButton = "_newPaperButton_1ba1v_2203";
const emptyState = "_emptyState_1ba1v_2218";
const newPaperButtonLarge = "_newPaperButtonLarge_1ba1v_2229";
const statusBadge = "_statusBadge_1ba1v_2248";
const published = "_published_1ba1v_940";
const draft = "_draft_1ba1v_2262";
const editButton = "_editButton_1ba1v_2268";
const deleteButton = "_deleteButton_1ba1v_2270";
const listViewContainer = "_listViewContainer_1ba1v_2312";
const listSidebar = "_listSidebar_1ba1v_2317";
const listFilters = "_listFilters_1ba1v_2325";
const listSidebarActions = "_listSidebarActions_1ba1v_2333";
const searchInputCompact = "_searchInputCompact_1ba1v_2341";
const filterSelectCompact = "_filterSelectCompact_1ba1v_2342";
const papersList = "_papersList_1ba1v_2357";
const paperListItem = "_paperListItem_1ba1v_2362";
const paperListItemHeader = "_paperListItemHeader_1ba1v_2379";
const paperListItemTitle = "_paperListItemTitle_1ba1v_2386";
const statusDot = "_statusDot_1ba1v_2397";
const paperListItemMeta = "_paperListItemMeta_1ba1v_2412";
const paperListItemDate = "_paperListItemDate_1ba1v_2419";
const paperListItemTags = "_paperListItemTags_1ba1v_2423";
const listDetail = "_listDetail_1ba1v_2427";
const noSelection = "_noSelection_1ba1v_2433";
const paperDetail = "_paperDetail_1ba1v_2442";
const paperDetailHeader = "_paperDetailHeader_1ba1v_2448";
const paperDetailTitle = "_paperDetailTitle_1ba1v_2457";
const paperDetailMeta = "_paperDetailMeta_1ba1v_2464";
const paperDetailDate = "_paperDetailDate_1ba1v_2470";
const paperDetailActions = "_paperDetailActions_1ba1v_2475";
const paperDetailContent = "_paperDetailContent_1ba1v_2486";
const paperDetailSection = "_paperDetailSection_1ba1v_2492";
const paperDetailTags = "_paperDetailTags_1ba1v_2506";
const paperDetailTag = "_paperDetailTag_1ba1v_2506";
const paperDetailPreview = "_paperDetailPreview_1ba1v_2520";
const paperListItemAuthor = "_paperListItemAuthor_1ba1v_2534";
const paperDetailViews = "_paperDetailViews_1ba1v_2539";
const paperDetailAuthor = "_paperDetailAuthor_1ba1v_2544";
const paperDetailMarkdownPreview = "_paperDetailMarkdownPreview_1ba1v_2549";
const diffContainer = "_diffContainer_1ba1v_2666";
const diffHeader = "_diffHeader_1ba1v_2675";
const diffOldTitle = "_diffOldTitle_1ba1v_2685";
const diffNewTitle = "_diffNewTitle_1ba1v_2686";
const diffArrow = "_diffArrow_1ba1v_2691";
const diffStats = "_diffStats_1ba1v_2695";
const diffAdditions = "_diffAdditions_1ba1v_2704";
const diffDeletions = "_diffDeletions_1ba1v_2709";
const diffUnchanged = "_diffUnchanged_1ba1v_2714";
const diffContent = "_diffContent_1ba1v_2718";
const diffLine = "_diffLine_1ba1v_2722";
const diffLineNumber = "_diffLineNumber_1ba1v_2730";
const diffLineContent = "_diffLineContent_1ba1v_2741";
const diffLinePrefix = "_diffLinePrefix_1ba1v_2747";
const diffAdded = "_diffAdded_1ba1v_2754";
const diffRemoved = "_diffRemoved_1ba1v_2762";
const diffSideBySide = "_diffSideBySide_1ba1v_2779";
const diffSide = "_diffSide_1ba1v_2779";
const diffSideHeader = "_diffSideHeader_1ba1v_2793";
const diffSideContent = "_diffSideContent_1ba1v_2802";
const diffViewOverlay = "_diffViewOverlay_1ba1v_2816";
const diffViewModal = "_diffViewModal_1ba1v_2829";
const diffViewHeader = "_diffViewHeader_1ba1v_2841";
const closeDiffButton = "_closeDiffButton_1ba1v_2857";
const diffViewContent = "_diffViewContent_1ba1v_2872";
const compareButton = "_compareButton_1ba1v_2880";
const revisionsPanelTitle = "_revisionsPanelTitle_1ba1v_2897";
const createVersionButton = "_createVersionButton_1ba1v_2904";
const revisionMeta = "_revisionMeta_1ba1v_2919";
const revisionAuthor = "_revisionAuthor_1ba1v_2927";
const revisionDescription = "_revisionDescription_1ba1v_2931";
const createVersionOverlay = "_createVersionOverlay_1ba1v_2942";
const createVersionModal = "_createVersionModal_1ba1v_2955";
const createVersionHeader = "_createVersionHeader_1ba1v_2964";
const closeCreateVersionButton = "_closeCreateVersionButton_1ba1v_2980";
const createVersionContent = "_createVersionContent_1ba1v_2995";
const createVersionDescription = "_createVersionDescription_1ba1v_2999";
const versionMessageInput = "_versionMessageInput_1ba1v_3006";
const createVersionActions = "_createVersionActions_1ba1v_3023";
const confirmCreateButton = "_confirmCreateButton_1ba1v_3030";
const mergeButton = "_mergeButton_1ba1v_3051";
const aiFeedbackButton = "_aiFeedbackButton_1ba1v_3066";
const mergeModalOverlay = "_mergeModalOverlay_1ba1v_3085";
const mergeModalContent = "_mergeModalContent_1ba1v_3098";
const mergeView = "_mergeView_1ba1v_3108";
const mergeHeader = "_mergeHeader_1ba1v_3114";
const mergeDescription = "_mergeDescription_1ba1v_3127";
const mergeActions = "_mergeActions_1ba1v_3133";
const selectAllButton = "_selectAllButton_1ba1v_3141";
const deselectAllButton = "_deselectAllButton_1ba1v_3142";
const togglePreviewButton = "_togglePreviewButton_1ba1v_3143";
const mergeContent = "_mergeContent_1ba1v_3161";
const mergeMainContent = "_mergeMainContent_1ba1v_3170";
const changeGroupsColumn = "_changeGroupsColumn_1ba1v_3178";
const mergePreviewColumn = "_mergePreviewColumn_1ba1v_3192";
const mergePreviewContent = "_mergePreviewContent_1ba1v_3206";
const changeGroupsList = "_changeGroupsList_1ba1v_3214";
const noChanges = "_noChanges_1ba1v_3227";
const changeGroup = "_changeGroup_1ba1v_3178";
const changeGroupHeader = "_changeGroupHeader_1ba1v_3251";
const changeGroupLabel = "_changeGroupLabel_1ba1v_3256";
const changeGroupCheckbox = "_changeGroupCheckbox_1ba1v_3263";
const changeGroupInfo = "_changeGroupInfo_1ba1v_3271";
const changeGroupTitle = "_changeGroupTitle_1ba1v_3275";
const changeGroupDescription = "_changeGroupDescription_1ba1v_3281";
const changeGroupType = "_changeGroupType_1ba1v_3287";
const addition = "_addition_1ba1v_3296";
const deletion = "_deletion_1ba1v_3301";
const modification = "_modification_1ba1v_3306";
const changeGroupDiff = "_changeGroupDiff_1ba1v_3311";
const diffCodeLine = "_diffCodeLine_1ba1v_3319";
const added = "_added_1ba1v_3326";
const removed = "_removed_1ba1v_3330";
const unchanged = "_unchanged_1ba1v_3334";
const contextLine = "_contextLine_1ba1v_3338";
const lineNumber = "_lineNumber_1ba1v_3342";
const linePrefix = "_linePrefix_1ba1v_3354";
const lineContent = "_lineContent_1ba1v_3372";
const changeGroupPreview = "_changeGroupPreview_1ba1v_3379";
const previewLine = "_previewLine_1ba1v_3385";
const moreLines = "_moreLines_1ba1v_3406";
const mergePreview = "_mergePreview_1ba1v_3192";
const mergeFooter = "_mergeFooter_1ba1v_3428";
const applyMergeButton = "_applyMergeButton_1ba1v_3437";
const markdownPreview = "_markdownPreview_1ba1v_3458";
const paperSelectionOverlay = "_paperSelectionOverlay_1ba1v_3465";
const paperSelectionModal = "_paperSelectionModal_1ba1v_3478";
const paperSelectionHeader = "_paperSelectionHeader_1ba1v_3490";
const closePaperSelectionButton = "_closePaperSelectionButton_1ba1v_3506";
const paperSelectionSearch = "_paperSelectionSearch_1ba1v_3521";
const paperSearchInput = "_paperSearchInput_1ba1v_3527";
const paperSelectionList = "_paperSelectionList_1ba1v_3542";
const noPapersFound = "_noPapersFound_1ba1v_3548";
const paperSelectionItem = "_paperSelectionItem_1ba1v_3554";
const paperSelectionTitle = "_paperSelectionTitle_1ba1v_3574";
const paperSelectionAbstract = "_paperSelectionAbstract_1ba1v_3581";
const paperSelectionDate = "_paperSelectionDate_1ba1v_3588";
const paperSelectionFooter = "_paperSelectionFooter_1ba1v_3593";
const selectPaperButton = "_selectPaperButton_1ba1v_3602";
const collapsed = "_collapsed_1ba1v_3638";
const mobileToggle = "_mobileToggle_1ba1v_3647";
const open = "_open_1ba1v_3662";
const paperPreview = "_paperPreview_1ba1v_3700";
const paperPreviewHeader = "_paperPreviewHeader_1ba1v_3704";
const paperPreviewMeta = "_paperPreviewMeta_1ba1v_3708";
const paperTag = "_paperTag_1ba1v_3713";
const paperPreviewActions = "_paperPreviewActions_1ba1v_3747";
const dashboardHeaderContent = "_dashboardHeaderContent_1ba1v_3802";
const dashboardHeaderFilters = "_dashboardHeaderFilters_1ba1v_3811";
const searchInput = "_searchInput_1ba1v_2341";
const filterSelect = "_filterSelect_1ba1v_2342";
const papersGrid = "_papersGrid_1ba1v_3837";
const paperGridCard = "_paperGridCard_1ba1v_3844";
const paperGridTitle = "_paperGridTitle_1ba1v_3867";
const paperGridAbstract = "_paperGridAbstract_1ba1v_3879";
const paperGridMeta = "_paperGridMeta_1ba1v_3891";
const paperGridTags = "_paperGridTags_1ba1v_3900";
const paperGridTag = "_paperGridTag_1ba1v_3900";
const statusPublished = "_statusPublished_1ba1v_3937";
const statusDraft = "_statusDraft_1ba1v_3942";
const aiFeedbackModal = "_aiFeedbackModal_1ba1v_3976";
const aiSettings = "_aiSettings_1ba1v_3988";
const aiProviderSelect = "_aiProviderSelect_1ba1v_3997";
const apiKeyInput = "_apiKeyInput_1ba1v_4007";
const apiKeyHint = "_apiKeyHint_1ba1v_4016";
const settingsActions = "_settingsActions_1ba1v_4023";
const saveSettingsButton = "_saveSettingsButton_1ba1v_4029";
const feedbackOptions = "_feedbackOptions_1ba1v_4050";
const feedbackPrompt = "_feedbackPrompt_1ba1v_4055";
const feedbackTypes = "_feedbackTypes_1ba1v_4061";
const feedbackType = "_feedbackType_1ba1v_4061";
const active = "_active_1ba1v_4080";
const feedbackError = "_feedbackError_1ba1v_4102";
const feedbackResult = "_feedbackResult_1ba1v_4111";
const feedbackContent = "_feedbackContent_1ba1v_4118";
const feedbackActions = "_feedbackActions_1ba1v_4147";
const generateButton = "_generateButton_1ba1v_4155";
const settingsButton = "_settingsButton_1ba1v_4176";
const modalClose = "_modalClose_1ba1v_4191";
const feedbackHistory = "_feedbackHistory_1ba1v_4213";
const noHistory = "_noHistory_1ba1v_4225";
const historyList = "_historyList_1ba1v_4232";
const historyItem = "_historyItem_1ba1v_4238";
const historyHeader = "_historyHeader_1ba1v_4249";
const historyType = "_historyType_1ba1v_4256";
const historyDate = "_historyDate_1ba1v_4261";
const historyContent = "_historyContent_1ba1v_4266";
const historyViewButton = "_historyViewButton_1ba1v_4279";
const styles$1 = {
  container,
  contentContainer,
  header,
  nav,
  navLinks,
  logo,
  paperGrid,
  paperCard,
  form,
  formGroup,
  label,
  error,
  checkboxLabel,
  checkbox,
  linkButton,
  termsContainer,
  success,
  hero,
  features,
  feature,
  editor,
  editorPane,
  preview,
  markdownTextarea,
  fullPageEditor,
  editorHeader,
  editorHeaderCenter,
  editorHeaderLeft,
  hidden,
  visible,
  editorHeaderRight,
  titleInput,
  metadataToggle,
  fadeIn,
  publishButton,
  viewModeToggle,
  toolbarToggle,
  insertToggle,
  saveButton,
  publishToggle,
  exitButton,
  metadataPanel,
  metadataContent,
  toolbarPopoverContainer,
  popoverFadeIn,
  toolbarPopover,
  toolbarSection,
  toolbarSectionTitle,
  toolbarRow,
  toolbarDivider,
  fontCategory,
  fontCategoryTitle,
  fontGrid,
  fontOption,
  selected,
  insertGrid,
  insertGridItem,
  insertPopoverContainer,
  insertPopover,
  insertPopoverTitle,
  contextMenu,
  contextMenuFadeIn,
  contextMenuTitle,
  contextMenuItems,
  contextMenuItem,
  contextMenuDivider,
  publishModalOverlay,
  publishModal,
  publishModalHeader,
  closePublishButton,
  publishModalContent,
  publishModalInfo,
  publishModalHint,
  publishModalBody,
  versionsList,
  versionItem,
  versionRadio,
  versionDetails,
  versionTitle,
  versionDate,
  versionStatus,
  versionMessage,
  versionDivider,
  publishModalActions,
  cancelPublishButton,
  confirmPublishButton,
  versionPreview,
  versionPreviewHeader,
  versionPreviewContent,
  loadingPreview,
  versionPreviewMeta,
  versionPreviewAbstract,
  versionPreviewTags,
  versionPreviewTag,
  versionPreviewDivider,
  versionPreviewMarkdown,
  publishedBadge,
  successModalOverlay,
  successModal,
  scaleIn,
  successModalContent,
  successIcon,
  bounce,
  successTitle,
  successMessage,
  successUrl,
  successUrlInput,
  copyButton,
  successActions,
  viewPublishedButton,
  continueEditingButton,
  readingProgress,
  paperMeta,
  tags,
  tag,
  sizeControls,
  sizeButton,
  sizeDisplay,
  insertButtonContainer,
  insertButton,
  insertMenu,
  insertMenuItem,
  undoButton,
  redoButton,
  editorError,
  editorContent,
  focusedMode,
  previewPane,
  modalOverlay,
  modalContent,
  modalHeader,
  closeButton,
  modalBody,
  formRow,
  modalActions,
  cancelButton,
  primaryButton,
  previewSection,
  imagePreview,
  insertImageResultHidden,
  uploadButton,
  downloadButton,
  uploadError,
  fileUploadModal,
  uploadArea,
  uploadAreaDragging,
  uploadAreaLabel,
  uploadIcon,
  uploadText,
  uploadHint,
  fileInfo,
  fileName,
  changeFileButton,
  previewContainer,
  previewTitle,
  previewContent,
  previewTruncated,
  saveStatus,
  saved,
  saving,
  pulse,
  unsaved,
  revisionsPanel,
  revisionsPanelHeader,
  closePanelButton,
  revisionsList,
  loadingRevisions,
  noRevisions,
  revisionItem,
  revisionInfo,
  revisionTitle,
  revisionDate,
  revisionMessage,
  revisionActions,
  viewButton,
  restoreButton,
  revisionPreviewOverlay,
  revisionPreviewModal,
  revisionPreviewHeader,
  revisionPreviewDate,
  closePreviewButton,
  revisionPreviewContent,
  revisionPreviewMetadata,
  revisionPreviewSection,
  revisionPreviewTags,
  revisionPreviewTag,
  revisionPreviewDivider,
  revisionPreviewMarkdown,
  replaceExistingOption,
  replaceExistingHint,
  dashboardContainer,
  dashboardHeader,
  dashboardActions,
  newPaperButton,
  emptyState,
  newPaperButtonLarge,
  statusBadge,
  published,
  draft,
  editButton,
  deleteButton,
  listViewContainer,
  listSidebar,
  listFilters,
  listSidebarActions,
  searchInputCompact,
  filterSelectCompact,
  papersList,
  paperListItem,
  paperListItemHeader,
  paperListItemTitle,
  statusDot,
  paperListItemMeta,
  paperListItemDate,
  paperListItemTags,
  listDetail,
  noSelection,
  paperDetail,
  paperDetailHeader,
  paperDetailTitle,
  paperDetailMeta,
  paperDetailDate,
  paperDetailActions,
  paperDetailContent,
  paperDetailSection,
  paperDetailTags,
  paperDetailTag,
  paperDetailPreview,
  paperListItemAuthor,
  paperDetailViews,
  paperDetailAuthor,
  paperDetailMarkdownPreview,
  diffContainer,
  diffHeader,
  diffOldTitle,
  diffNewTitle,
  diffArrow,
  diffStats,
  diffAdditions,
  diffDeletions,
  diffUnchanged,
  diffContent,
  diffLine,
  diffLineNumber,
  diffLineContent,
  diffLinePrefix,
  diffAdded,
  diffRemoved,
  diffSideBySide,
  diffSide,
  diffSideHeader,
  diffSideContent,
  diffViewOverlay,
  diffViewModal,
  diffViewHeader,
  closeDiffButton,
  diffViewContent,
  compareButton,
  revisionsPanelTitle,
  createVersionButton,
  revisionMeta,
  revisionAuthor,
  revisionDescription,
  createVersionOverlay,
  createVersionModal,
  createVersionHeader,
  closeCreateVersionButton,
  createVersionContent,
  createVersionDescription,
  versionMessageInput,
  createVersionActions,
  confirmCreateButton,
  mergeButton,
  aiFeedbackButton,
  mergeModalOverlay,
  mergeModalContent,
  mergeView,
  mergeHeader,
  mergeDescription,
  mergeActions,
  selectAllButton,
  deselectAllButton,
  togglePreviewButton,
  mergeContent,
  mergeMainContent,
  changeGroupsColumn,
  mergePreviewColumn,
  mergePreviewContent,
  changeGroupsList,
  noChanges,
  changeGroup,
  changeGroupHeader,
  changeGroupLabel,
  changeGroupCheckbox,
  changeGroupInfo,
  changeGroupTitle,
  changeGroupDescription,
  changeGroupType,
  addition,
  deletion,
  modification,
  changeGroupDiff,
  diffCodeLine,
  added,
  removed,
  unchanged,
  contextLine,
  lineNumber,
  linePrefix,
  lineContent,
  changeGroupPreview,
  previewLine,
  moreLines,
  mergePreview,
  mergeFooter,
  applyMergeButton,
  markdownPreview,
  paperSelectionOverlay,
  paperSelectionModal,
  paperSelectionHeader,
  closePaperSelectionButton,
  paperSelectionSearch,
  paperSearchInput,
  paperSelectionList,
  noPapersFound,
  paperSelectionItem,
  paperSelectionTitle,
  paperSelectionAbstract,
  paperSelectionDate,
  paperSelectionFooter,
  selectPaperButton,
  collapsed,
  mobileToggle,
  open,
  paperPreview,
  paperPreviewHeader,
  paperPreviewMeta,
  paperTag,
  paperPreviewActions,
  dashboardHeaderContent,
  dashboardHeaderFilters,
  searchInput,
  filterSelect,
  papersGrid,
  paperGridCard,
  paperGridTitle,
  paperGridAbstract,
  paperGridMeta,
  paperGridTags,
  paperGridTag,
  statusPublished,
  statusDraft,
  aiFeedbackModal,
  aiSettings,
  aiProviderSelect,
  apiKeyInput,
  apiKeyHint,
  settingsActions,
  saveSettingsButton,
  feedbackOptions,
  feedbackPrompt,
  feedbackTypes,
  feedbackType,
  active,
  feedbackError,
  feedbackResult,
  feedbackContent,
  feedbackActions,
  generateButton,
  settingsButton,
  modalClose,
  feedbackHistory,
  noHistory,
  historyList,
  historyItem,
  historyHeader,
  historyType,
  historyDate,
  historyContent,
  historyViewButton
};
function Layout() {
  const { user, logout } = useAuth();
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("header", { className: styles$1.header, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.container, children: /* @__PURE__ */ jsxRuntime.jsxs("nav", { className: styles$1.nav, children: [
      /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Link, { to: "/", className: styles$1.logo, children: "Paper" }),
      /* @__PURE__ */ jsxRuntime.jsxs("ul", { className: styles$1.navLinks, children: [
        /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Link, { to: "/", children: "Browse" }) }),
        user ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Link, { to: "/dashboard", children: "Dashboard" }) }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Link, { to: "/editor", children: "New Paper" }) }),
          /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: logout, children: "Logout" }) })
        ] }) : /* @__PURE__ */ jsxRuntime.jsx("li", { children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Link, { to: "/login", children: "Login" }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntime.jsx("main", { children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Outlet, {}) })
  ] });
}
marked.marked.setOptions({
  gfm: true,
  breaks: true
  // Allow HTML tags in markdown
  // Note: This allows raw HTML which could be a security risk if content comes from untrusted sources
  // Since this is for user's own content, it should be safe
});
function MarkdownRenderer({ content, font }) {
  const html = React.useMemo(() => marked.marked(content), [content]);
  React.useEffect(() => {
    Prism.highlightAll();
  }, [html]);
  const getFontFamily = (fontValue) => {
    if (!fontValue) return "Golos Text, -apple-system, BlinkMacSystemFont, sans-serif";
    const fontMap = {
      // Sans-serif
      "inter": "'Inter', sans-serif",
      "open-sans": "'Open Sans', sans-serif",
      "poppins": "'Poppins', sans-serif",
      "raleway": "'Raleway', sans-serif",
      "montserrat": "'Montserrat', sans-serif",
      "work-sans": "'Work Sans', sans-serif",
      "source-sans": "'Source Sans 3', sans-serif",
      "ibm-plex": "'IBM Plex Sans', sans-serif",
      "system": '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      // Serif
      "merriweather": "'Merriweather', serif",
      "playfair": "'Playfair Display', serif",
      "lora": "'Lora', serif",
      "crimson": "'Crimson Text', serif",
      "noto-serif": "'Noto Serif', serif",
      "eb-garamond": "'EB Garamond', serif",
      "libre-baskerville": "'Libre Baskerville', serif",
      "roboto-slab": "'Roboto Slab', serif",
      // Monospace
      "golos": "'Golos Text', monospace",
      "jetbrains": "'JetBrains Mono', monospace",
      "fira-code": "'Fira Code', monospace",
      "mono": '"SF Mono", Monaco, Consolas, monospace'
    };
    return fontMap[fontValue] || fontMap["golos"];
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: "markdown-content",
      dangerouslySetInnerHTML: { __html: html },
      style: {
        backgroundColor: "#faf8f5",
        color: "#3d3a34",
        padding: "24px",
        minHeight: "100%",
        fontFamily: getFontFamily(font),
        fontSize: "16px",
        lineHeight: "1.7"
      }
    }
  );
}
function useMobileToggle() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const toggle = () => setIsOpen(!isOpen);
  return { isMobile, isOpen, toggle };
}
function HomePage() {
  const [papers, setPapers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPaper, setSelectedPaper] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState("");
  const [authorFilter, setAuthorFilter] = React.useState("");
  const navigate = reactRouterDom.useNavigate();
  const { isMobile, isOpen, toggle } = useMobileToggle();
  React.useEffect(() => {
    api.get("/papers").then(({ papers: papers2 }) => {
      setPapers(papers2);
      if (papers2.length > 0 && !selectedPaper) {
        setSelectedPaper(papers2[0]);
      }
    }).finally(() => setLoading(false));
  }, []);
  const formatDate = (dateValue) => {
    if (!dateValue) return "Unknown date";
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "Unknown date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "Unknown date";
    }
  };
  const getAuthorName = (email) => {
    return email.split("@")[0];
  };
  const allTags = Array.from(new Set(papers.flatMap((p) => p.tags)));
  const allAuthors = Array.from(new Set(papers.map((p) => p.paper.user.email)));
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch = searchQuery === "" || paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) || paper.tags.some((tag2) => tag2.toLowerCase().includes(searchQuery.toLowerCase())) || paper.paper.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = tagFilter === "" || paper.tags.includes(tagFilter);
    const matchesAuthor = authorFilter === "" || paper.paper.user.email === authorFilter;
    return matchesSearch && matchesTag && matchesAuthor;
  });
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const currentIndex = filteredPapers.findIndex((p) => p.id === (selectedPaper == null ? void 0 : selectedPaper.id));
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            setSelectedPaper(filteredPapers[currentIndex - 1]);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < filteredPapers.length - 1) {
            setSelectedPaper(filteredPapers[currentIndex + 1]);
          }
          break;
        case "Enter":
          e.preventDefault();
          if (selectedPaper) {
            navigate(`/p/${selectedPaper.slug}`);
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPaper, filteredPapers, navigate]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.container, children: "Loading..." });
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.dashboardContainer, children: papers.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.emptyState, children: /* @__PURE__ */ jsxRuntime.jsx("p", { children: "No papers have been published yet." }) }) : isMobile ? (
    // Mobile view - Grid layout
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.dashboardContainer, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.dashboardHeader, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.dashboardHeaderContent, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.dashboardHeaderFilters, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search papers...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: styles$1.searchInput
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "select",
          {
            value: authorFilter,
            onChange: (e) => setAuthorFilter(e.target.value),
            className: styles$1.filterSelect,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "All Authors" }),
              allAuthors.map((author) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: author, children: getAuthorName(author) }, author))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "select",
          {
            value: tagFilter,
            onChange: (e) => setTagFilter(e.target.value),
            className: styles$1.filterSelect,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "All Tags" }),
              allTags.map((tag2) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: tag2, children: tag2 }, tag2))
            ]
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.papersGrid, children: filteredPapers.map((paper) => /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: styles$1.paperGridCard,
          onClick: () => navigate(`/p/${paper.slug}`),
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("h3", { className: styles$1.paperGridTitle, children: paper.title }),
            paper.abstract && /* @__PURE__ */ jsxRuntime.jsx("p", { className: styles$1.paperGridAbstract, children: paper.abstract }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperGridMeta, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: formatDate(paper.publishedAt) }),
              paper.viewCount !== void 0 && /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
                paper.viewCount,
                " views"
              ] })
            ] }),
            paper.tags.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperGridTags, children: [
              paper.tags.slice(0, 3).map((tag2, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperGridTag, children: tag2 }, i)),
              paper.tags.length > 3 && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.paperGridTag, children: [
                "+",
                paper.tags.length - 3
              ] })
            ] })
          ]
        },
        paper.id
      )) })
    ] })
  ) : (
    // Desktop view - List layout
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.listViewContainer, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `${styles$1.listSidebar} ${isMobile && !isOpen ? styles$1.collapsed : ""}`, children: [
        isMobile && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `${styles$1.mobileToggle} ${isOpen ? styles$1.open : ""}`, onClick: toggle, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
            "Filter Papers (",
            filteredPapers.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.listFilters, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search papers...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: styles$1.searchInputCompact
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "select",
            {
              value: authorFilter,
              onChange: (e) => setAuthorFilter(e.target.value),
              className: styles$1.filterSelectCompact,
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "All Authors" }),
                allAuthors.map((author) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: author, children: getAuthorName(author) }, author))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "select",
            {
              value: tagFilter,
              onChange: (e) => setTagFilter(e.target.value),
              className: styles$1.filterSelectCompact,
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "All Tags" }),
                allTags.map((tag2) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: tag2, children: tag2 }, tag2))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.papersList, children: filteredPapers.map((paper) => /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: `${styles$1.paperListItem} ${(selectedPaper == null ? void 0 : selectedPaper.id) === paper.id ? styles$1.selected : ""}`,
            onClick: () => setSelectedPaper(paper),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperListItemHeader, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperListItemTitle, children: paper.title }) }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperListItemMeta, children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperListItemDate, children: formatDate(paper.publishedAt) }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperListItemAuthor, children: getAuthorName(paper.paper.user.email) }),
                paper.viewCount !== void 0 && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.paperListItemMeta, children: [
                  paper.viewCount,
                  " ",
                  paper.viewCount === 1 ? "view" : "views"
                ] })
              ] })
            ]
          },
          paper.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.listDetail, children: selectedPaper ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetail, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetailHeader, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("h2", { className: styles$1.paperDetailTitle, children: selectedPaper.title }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetailMeta, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperDetailDate, children: formatDate(selectedPaper.publishedAt) }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperDetailAuthor, children: getAuthorName(selectedPaper.paper.user.email) }),
              selectedPaper.viewCount !== void 0 && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.paperDetailViews, children: [
                selectedPaper.viewCount,
                " ",
                selectedPaper.viewCount === 1 ? "view" : "views"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperDetailActions, children: /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => navigate(`/p/${selectedPaper.slug}`),
              className: styles$1.viewButton,
              children: "Read"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetailContent, children: [
          selectedPaper.abstract && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetailSection, children: [
            /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "Abstract" }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { children: selectedPaper.abstract })
          ] }),
          selectedPaper.tags.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetailSection, children: [
            /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "Tags" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperDetailTags, children: selectedPaper.tags.map((tag2, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperDetailTag, children: tag2 }, i)) })
          ] }),
          selectedPaper.content && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperDetailSection, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperDetailMarkdownPreview, children: /* @__PURE__ */ jsxRuntime.jsx(
            MarkdownRenderer,
            {
              content: selectedPaper.content.length > 1e3 ? selectedPaper.content.substring(0, 1e3) + "..." : selectedPaper.content
            }
          ) }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.noSelection, children: /* @__PURE__ */ jsxRuntime.jsx("p", { children: "Select a paper from the list to view details" }) }) })
    ] })
  ) });
}
const TermsOfService = () => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "prose prose-sm max-w-none", children: [
    /* @__PURE__ */ jsxRuntime.jsx("h2", { className: "text-lg font-semibold mb-4", children: "Paper Terms of Service" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4 text-sm text-gray-600", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-medium text-gray-800", children: "1. Acceptance of Terms" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "By using Paper, you agree to these Terms of Service. If you don't agree, please don't use our service." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-medium text-gray-800", children: "2. Use of Service" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "You may use Paper to create, edit, and share documents. You agree to use the service responsibly and legally." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-medium text-gray-800", children: "3. Your Content" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "You retain ownership of content you create on Paper. By publishing content, you grant Paper a license to display and distribute it according to your chosen settings." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-medium text-gray-800", children: "4. Privacy" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "We respect your privacy and will only use your email address for authentication and important service notifications." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-medium text-gray-800", children: "5. Prohibited Use" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "You may not use Paper for illegal activities, spam, harassment, or to distribute malicious content." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-medium text-gray-800", children: "6. Service Availability" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "We strive to keep Paper available 24/7 but cannot guarantee uninterrupted service." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-medium text-gray-800", children: "7. Changes to Terms" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "We may update these terms occasionally. Continued use of Paper constitutes acceptance of any changes." })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-medium text-gray-800", children: "8. Contact" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { children: "If you have questions about these terms, please contact us through the Paper platform." })
      ] })
    ] })
  ] });
};
function LoginPage() {
  const navigate = reactRouterDom.useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [step, setStep] = React.useState("email");
  const [error2, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    if (!acceptedTerms) {
      setError("Please accept the Terms of Service to continue");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/request-code", { email, acceptedTerms });
      setStep("code");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { sessionId } = await api.post("/auth/verify-code", { email, code });
      login(sessionId);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.contentContainer, children: [
    /* @__PURE__ */ jsxRuntime.jsx("h1", { children: "Login" }),
    step === "email" ? /* @__PURE__ */ jsxRuntime.jsxs("form", { onSubmit: handleRequestCode, className: styles$1.form, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "email", className: styles$1.label, children: "Email" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            id: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            autoFocus: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.formGroup, children: /* @__PURE__ */ jsxRuntime.jsxs("label", { className: styles$1.checkboxLabel, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            type: "checkbox",
            checked: acceptedTerms,
            onChange: (e) => setAcceptedTerms(e.target.checked),
            className: styles$1.checkbox
          }
        ),
        "I agree to the",
        " ",
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowTerms(!showTerms),
            className: styles$1.linkButton,
            children: "Terms of Service"
          }
        )
      ] }) }),
      showTerms && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.termsContainer, children: /* @__PURE__ */ jsxRuntime.jsx(TermsOfService, {}) }),
      error2 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.error, children: error2 }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { type: "submit", disabled: loading || !acceptedTerms, children: loading ? "Sending..." : "Send Code" })
    ] }) : /* @__PURE__ */ jsxRuntime.jsxs("form", { onSubmit: handleVerifyCode, className: styles$1.form, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("p", { children: [
        "Enter the 6-digit code sent to ",
        email
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "code", className: styles$1.label, children: "Verification Code" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            id: "code",
            type: "text",
            value: code,
            onChange: (e) => setCode(e.target.value),
            pattern: "[0-9]{6}",
            maxLength: 6,
            required: true,
            autoFocus: true
          }
        )
      ] }),
      error2 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.error, children: error2 }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("button", { type: "submit", disabled: loading, children: loading ? "Verifying..." : "Verify" }),
        /* @__PURE__ */ jsxRuntime.jsx("button", { type: "button", onClick: () => setStep("email"), children: "Use different email" })
      ] })
    ] })
  ] });
}
function useOpenGraph(data) {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = data.title ? `${data.title} - Paper` : "Paper";
    const setMetaTag = (property, content, isName = false) => {
      const attributeName = isName ? "name" : "property";
      let metaTag = document.querySelector(`meta[${attributeName}="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute(attributeName, property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    };
    if (data.description) {
      setMetaTag("description", data.description, true);
    }
    setMetaTag("og:title", data.title);
    if (data.description) setMetaTag("og:description", data.description);
    if (data.image) {
      setMetaTag("og:image", data.image);
      setMetaTag("og:image:width", "1200");
      setMetaTag("og:image:height", "630");
    }
    if (data.url) setMetaTag("og:url", data.url);
    setMetaTag("og:type", data.type || "article");
    setMetaTag("og:site_name", data.siteName || "Paper");
    if (data.author) setMetaTag("article:author", data.author);
    if (data.publishedTime) setMetaTag("article:published_time", data.publishedTime);
    if (data.tags) {
      data.tags.forEach((tag2, index) => {
        setMetaTag(`article:tag:${index}`, tag2);
      });
    }
    setMetaTag("twitter:card", "summary_large_image", true);
    setMetaTag("twitter:title", data.title, true);
    if (data.description) setMetaTag("twitter:description", data.description, true);
    if (data.image) setMetaTag("twitter:image", data.image, true);
    return () => {
      document.title = "Paper";
      const metaTags = document.querySelectorAll('meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"], meta[name="description"]');
      metaTags.forEach((tag2) => {
        if (tag2.parentNode === document.head) {
          document.head.removeChild(tag2);
        }
      });
    };
  }, [data]);
}
function PaperPage() {
  var _a, _b, _c, _d, _e, _f;
  const { slug } = reactRouterDom.useParams();
  const initialData = typeof window !== "undefined" && window.__PAPER_DATA__;
  const [paper, setPaper] = React.useState(initialData || null);
  const [loading, setLoading] = React.useState(!initialData);
  const [error2, setError] = React.useState("");
  React.useEffect(() => {
    if (!slug || initialData) return;
    api.get(`/papers/${slug}`).then(({ paper: paper2 }) => setPaper(paper2)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [slug, initialData]);
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.__PAPER_DATA__) {
      delete window.__PAPER_DATA__;
    }
  }, []);
  useOpenGraph({
    title: (paper == null ? void 0 : paper.title) || "",
    description: (paper == null ? void 0 : paper.abstract) || (paper == null ? void 0 : paper.content) || "",
    image: paper && typeof window !== "undefined" ? `${window.location.origin}/api/og-image/${slug}` : void 0,
    url: typeof window !== "undefined" ? window.location.href : "",
    type: "article",
    siteName: "Paper",
    author: ((_a = paper == null ? void 0 : paper.user) == null ? void 0 : _a.email) || ((_c = (_b = paper == null ? void 0 : paper.paper) == null ? void 0 : _b.user) == null ? void 0 : _c.email) || "Anonymous",
    publishedTime: paper == null ? void 0 : paper.publishedAt,
    tags: (paper == null ? void 0 : paper.tags) || []
  });
  React.useEffect(() => {
    const handleScroll = () => {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const progressBar = document.getElementById("reading-progress");
      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.contentContainer, children: "Loading..." });
  }
  if (error2 || !paper) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.contentContainer, children: "Paper not found" });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { id: "reading-progress", className: styles$1.readingProgress, style: { transform: "scaleX(0)" } }),
    /* @__PURE__ */ jsxRuntime.jsxs("article", { className: styles$1.contentContainer, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("header", { style: { marginBottom: "var(--space-xl)" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h1", { children: paper.title }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperMeta, children: [
          ((_d = paper.user) == null ? void 0 : _d.email) || ((_f = (_e = paper.paper) == null ? void 0 : _e.user) == null ? void 0 : _f.email) || "Anonymous",
          " • ",
          new Date(paper.publishedAt).toLocaleDateString(),
          paper.viewCount !== void 0 && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            " • ",
            paper.viewCount,
            " ",
            paper.viewCount === 1 ? "view" : "views"
          ] })
        ] }),
        paper.abstract && /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: "var(--size-lg)", fontStyle: "italic", marginTop: "var(--space-md)" }, children: paper.abstract }),
        paper.tags.length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.tags, style: { marginTop: "var(--space-md)" }, children: paper.tags.map((tag2) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.tag, children: tag2 }, tag2)) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(MarkdownRenderer, { content: paper.content || "", font: paper.font })
    ] })
  ] });
}
function useUndoRedo(initialValue, maxHistorySize = 50) {
  const [history, setHistory] = React.useState([
    { value: initialValue, selectionStart: 0, selectionEnd: 0 }
  ]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const isInternalChange = React.useRef(false);
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  const addToHistory = React.useCallback((value, selectionStart, selectionEnd) => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      newHistory.push({ value, selectionStart, selectionEnd });
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setCurrentIndex((prev) => Math.min(prev + 1, maxHistorySize - 1));
  }, [currentIndex, maxHistorySize]);
  const undo = React.useCallback(() => {
    if (canUndo) {
      isInternalChange.current = true;
      setCurrentIndex((prev) => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [canUndo, currentIndex, history]);
  const redo = React.useCallback(() => {
    if (canRedo) {
      isInternalChange.current = true;
      setCurrentIndex((prev) => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [canRedo, currentIndex, history]);
  const reset = React.useCallback((value) => {
    setHistory([{ value, selectionStart: 0, selectionEnd: 0 }]);
    setCurrentIndex(0);
  }, []);
  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    reset
  };
}
const confettiCanvas = "_confettiCanvas_ahi4v_1";
const styles = {
  confettiCanvas
};
function Confetti() {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#f0932b", "#eb4d4b", "#6ab04c", "#e056fd", "#686de0"];
    const particles = [];
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.2,
        life: 1
      });
    }
    let animationId;
    const gravity = 0.1;
    const friction = 0.99;
    const fadeSpeed = 0.02;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, index) => {
        particle.vy += gravity;
        particle.vx *= friction;
        particle.vy *= friction;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.angle += particle.angleSpeed;
        particle.life -= fadeSpeed;
        if (particle.life <= 0 || particle.y > canvas.height) {
          particles.splice(index, 1);
          return;
        }
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle);
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
      });
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animate();
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx("canvas", { ref: canvasRef, className: styles.confettiCanvas });
}
function ImageInsertDialog({ onInsert, onClose }) {
  const [imageUrl, setImageUrl] = React.useState("");
  const [altText, setAltText] = React.useState("");
  const [width, setWidth] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [alignment, setAlignment] = React.useState("none");
  const handleInsert = () => {
    if (!imageUrl) return;
    let imgTag = `<img src="${imageUrl}" alt="${altText}"`;
    if (width) {
      imgTag += ` width="${width}"`;
    }
    if (height) {
      imgTag += ` height="${height}"`;
    }
    if (alignment !== "none") {
      const styleMap = {
        left: "float: left; margin-right: 1em;",
        right: "float: right; margin-left: 1em;",
        center: "display: block; margin: 0 auto;"
      };
      imgTag += ` style="${styleMap[alignment]}"`;
    }
    imgTag += " />";
    onInsert(imgTag);
    onClose();
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.modalOverlay, onClick: onClose, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.modalContent, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.modalHeader, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "Insert Image" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: styles$1.closeButton, onClick: onClose, children: "×" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.modalBody, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { className: styles$1.label, children: "Image URL *" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            type: "url",
            value: imageUrl,
            onChange: (e) => setImageUrl(e.target.value),
            placeholder: "https://example.com/image.jpg",
            autoFocus: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { className: styles$1.label, children: "Alt Text" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            type: "text",
            value: altText,
            onChange: (e) => setAltText(e.target.value),
            placeholder: "Description of the image"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formRow, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
          /* @__PURE__ */ jsxRuntime.jsx("label", { className: styles$1.label, children: "Width" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: width,
              onChange: (e) => setWidth(e.target.value),
              placeholder: "e.g., 500px or 100%"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
          /* @__PURE__ */ jsxRuntime.jsx("label", { className: styles$1.label, children: "Height" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: height,
              onChange: (e) => setHeight(e.target.value),
              placeholder: "e.g., 300px or auto"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { className: styles$1.label, children: "Alignment" }),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "select",
          {
            value: alignment,
            onChange: (e) => setAlignment(e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "none", children: "None" }),
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "left", children: "Float Left" }),
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "center", children: "Center" }),
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "right", children: "Float Right" })
            ]
          }
        )
      ] }),
      imageUrl && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.previewSection, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { className: styles$1.label, children: "Preview:" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.imagePreview, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "img",
            {
              src: imageUrl,
              alt: altText,
              style: {
                maxWidth: "100%",
                width: width || "auto",
                height: height || "auto",
                ...alignment === "center" && { display: "block", margin: "0 auto" },
                ...alignment === "left" && { float: "left", marginRight: "1em" },
                ...alignment === "right" && { float: "right", marginLeft: "1em" }
              },
              onError: (e) => {
                var _a;
                e.currentTarget.style.display = "none";
                (_a = e.currentTarget.nextElementSibling) == null ? void 0 : _a.classList.remove(styles$1.hidden);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${styles$1.error} ${styles$1.insertImageResultHidden}`, children: "Failed to load image" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.modalActions, children: [
      /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: onClose, className: styles$1.cancelButton, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          onClick: handleInsert,
          disabled: !imageUrl,
          className: styles$1.primaryButton,
          children: "Insert"
        }
      )
    ] })
  ] }) });
}
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-"
});
turndownService.addRule("strikethrough", {
  filter: ["del", "s"],
  replacement: (content) => `~~${content}~~`
});
const markdownHandler = {
  accept: ".md,.markdown",
  extensions: ["md", "markdown"],
  handler: async (file) => {
    const content = await file.text();
    console.log("Processing markdown file:", file.name, content);
    return content;
  }
};
const textHandler = {
  accept: ".txt",
  extensions: ["txt"],
  handler: async (file) => {
    const text = await file.text();
    return text.split("\n\n").map((paragraph) => paragraph.trim()).filter((p) => p.length > 0).join("\n\n");
  }
};
const docxHandler = {
  accept: ".docx",
  extensions: ["docx"],
  handler: async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      if (result.messages.length > 0) {
        console.warn("Conversion warnings:", result.messages);
      }
      const markdown = turndownService.turndown(result.value);
      return markdown;
    } catch (error2) {
      console.error("Error converting .docx file:", error2);
      throw new Error("Failed to convert .docx file. Please ensure it's a valid Word document.");
    }
  }
};
const fileHandlers = [
  markdownHandler,
  textHandler,
  docxHandler
];
const getAcceptedFileTypes = () => {
  return fileHandlers.map((h) => h.accept).join(",");
};
const processFile = async (file) => {
  var _a;
  console.log("Processing file:", file.name, file.type);
  const extension = (_a = file.name.split(".").pop()) == null ? void 0 : _a.toLowerCase();
  const handler = fileHandlers.find(
    (h) => h.extensions.includes(extension || "")
  );
  if (!handler) {
    throw new Error(`Unsupported file type: .${extension}. Supported types: .md, .txt, .docx`);
  }
  return await handler.handler(file);
};
const downloadMarkdown = (content, filename = "document.md") => {
  if (!filename.endsWith(".md")) {
    filename += ".md";
  }
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
function FileUploadModal({ onConfirm, onClose }) {
  const fileInputRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error2, setError] = React.useState(null);
  const [preview2, setPreview] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const processSelectedFile = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const content = await processFile(file);
      setPreview({ content, filename: file.name });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file");
      console.error("File upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFileSelect = async (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    await processSelectedFile(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await processSelectedFile(file);
    }
  };
  const handleConfirm = () => {
    if (preview2) {
      onConfirm(preview2.content, preview2.filename);
      onClose();
    }
  };
  const handleSelectNewFile = () => {
    var _a;
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  const getPreviewExcerpt = (content, maxLength = 500) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.modalOverlay, onClick: onClose, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.fileUploadModal, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.modalHeader, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "Upload File" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: styles$1.closeButton, onClick: onClose, children: "×" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.modalBody, children: !preview2 ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: `${styles$1.uploadArea} ${isDragging ? styles$1.uploadAreaDragging : ""}`,
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: getAcceptedFileTypes(),
                onChange: handleFileSelect,
                style: { display: "none" },
                id: "modal-file-upload"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(
              "label",
              {
                htmlFor: "modal-file-upload",
                className: styles$1.uploadAreaLabel,
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.uploadIcon, children: "📄" }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.uploadText, children: isLoading ? "Loading..." : isDragging ? "Drop file here" : "Click to select or drag & drop a file" }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.uploadHint, children: "Supports .md, .txt, and .docx files" })
                ]
              }
            )
          ]
        }
      ),
      error2 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.error, style: { marginTop: "1rem" }, children: error2 })
    ] }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.fileInfo, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.fileName, children: [
          /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "File:" }),
          " ",
          preview2.filename
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            onClick: handleSelectNewFile,
            className: styles$1.changeFileButton,
            children: "Choose different file"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.previewContainer, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h4", { className: styles$1.previewTitle, children: "Preview:" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.previewContent, children: /* @__PURE__ */ jsxRuntime.jsx("pre", { children: getPreviewExcerpt(preview2.content) }) }),
        preview2.content.length > 500 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.previewTruncated, children: "Preview truncated. Full content will be loaded on confirm." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.modalActions, children: [
      /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: onClose, className: styles$1.cancelButton, children: "Cancel" }),
      preview2 && /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          onClick: handleConfirm,
          className: styles$1.primaryButton,
          children: "Load into Editor"
        }
      )
    ] })
  ] }) });
}
function splitIntoLines(text) {
  return text.split("\n");
}
function computeLCS(lines1, lines2) {
  const m = lines1.length;
  const n = lines2.length;
  const lcs = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1;
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
      }
    }
  }
  return lcs;
}
function generateDiff(oldText, newText) {
  const oldLines = splitIntoLines(oldText);
  const newLines = splitIntoLines(newText);
  const lcs = computeLCS(oldLines, newLines);
  const diffLines = [];
  let additions = 0;
  let deletions = 0;
  let unchanged2 = 0;
  let i = oldLines.length;
  let j = newLines.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      diffLines.unshift({
        type: "unchanged",
        content: oldLines[i - 1],
        oldLineNumber: i,
        newLineNumber: j
      });
      unchanged2++;
      i--;
      j--;
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      diffLines.unshift({
        type: "added",
        content: newLines[j - 1],
        newLineNumber: j
      });
      additions++;
      j--;
    } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
      diffLines.unshift({
        type: "removed",
        content: oldLines[i - 1],
        oldLineNumber: i
      });
      deletions++;
      i--;
    }
  }
  return {
    lines: diffLines,
    additions,
    deletions,
    unchanged: unchanged2
  };
}
function generateSideBySideDiff(oldText, newText) {
  const diff = generateDiff(oldText, newText);
  const left = [];
  const right = [];
  for (const line of diff.lines) {
    if (line.type === "unchanged") {
      left.push(line);
      right.push(line);
    } else if (line.type === "removed") {
      left.push(line);
      right.push({ type: "unchanged", content: "", lineNumber: void 0 });
    } else if (line.type === "added") {
      left.push({ type: "unchanged", content: "", lineNumber: void 0 });
      right.push(line);
    }
  }
  return { left, right };
}
function DiffViewer({
  oldContent,
  newContent,
  oldTitle = "Previous Version",
  newTitle = "Current Version",
  viewMode = "unified"
}) {
  const [diff, setDiff] = React.useState(null);
  const [sideBySide, setSideBySide] = React.useState(null);
  React.useEffect(() => {
    const diffResult = generateDiff(oldContent, newContent);
    setDiff(diffResult);
    if (viewMode === "side-by-side") {
      const sideBySideResult = generateSideBySideDiff(oldContent, newContent);
      setSideBySide(sideBySideResult);
    }
  }, [oldContent, newContent, viewMode]);
  if (!diff) return null;
  const renderLineNumber = (num) => {
    return num ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.diffLineNumber, children: num }) : /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.diffLineNumber, children: " " });
  };
  const renderUnifiedDiff = () => {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffContainer, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffHeader, children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.diffOldTitle, children: oldTitle }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.diffArrow, children: "→" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.diffNewTitle, children: newTitle })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffStats, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.diffAdditions, children: [
          "+",
          diff.additions
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.diffDeletions, children: [
          "-",
          diff.deletions
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.diffUnchanged, children: [
          diff.unchanged,
          " unchanged"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.diffContent, children: diff.lines.map((line, index) => /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: `${styles$1.diffLine} ${styles$1[`diff${line.type.charAt(0).toUpperCase() + line.type.slice(1)}`]}`,
          children: [
            renderLineNumber(line.oldLineNumber),
            renderLineNumber(line.newLineNumber),
            /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.diffLineContent, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.diffLinePrefix, children: line.type === "added" ? "+" : line.type === "removed" ? "-" : " " }),
              line.content || " "
            ] })
          ]
        },
        index
      )) })
    ] });
  };
  const renderSideBySideDiff = () => {
    if (!sideBySide) return null;
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffContainer, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffSideBySide, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffSide, children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.diffSideHeader, children: oldTitle }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.diffSideContent, children: sideBySide.left.map((line, index) => /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              className: `${styles$1.diffLine} ${line.type !== "unchanged" ? styles$1[`diff${line.type.charAt(0).toUpperCase() + line.type.slice(1)}`] : ""}`,
              children: [
                renderLineNumber(line.oldLineNumber || line.lineNumber),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.diffLineContent, children: line.content || " " })
              ]
            },
            index
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffSide, children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.diffSideHeader, children: newTitle }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.diffSideContent, children: sideBySide.right.map((line, index) => /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              className: `${styles$1.diffLine} ${line.type !== "unchanged" ? styles$1[`diff${line.type.charAt(0).toUpperCase() + line.type.slice(1)}`] : ""}`,
              children: [
                renderLineNumber(line.newLineNumber || line.lineNumber),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.diffLineContent, children: line.content || " " })
              ]
            },
            index
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffStats, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.diffAdditions, children: [
          "+",
          diff.additions
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.diffDeletions, children: [
          "-",
          diff.deletions
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.diffUnchanged, children: [
          diff.unchanged,
          " unchanged"
        ] })
      ] })
    ] });
  };
  return viewMode === "unified" ? renderUnifiedDiff() : renderSideBySideDiff();
}
function extractHeadingFromLines(lines, startIdx) {
  for (let i = startIdx; i >= 0; i--) {
    const line = lines[i];
    if (line.type === "unchanged" || line.type === "removed") {
      const headingMatch = line.content.match(/^#+\s+(.+)$/);
      if (headingMatch) {
        return headingMatch[1].trim();
      }
    }
  }
  return null;
}
function groupConsecutiveChanges(diffLines) {
  const groups = [];
  let currentGroup = [];
  let groupType = null;
  let groupStartIdx = -1;
  const contextLines = 3;
  for (let i = 0; i < diffLines.length; i++) {
    const line = diffLines[i];
    if (line.type === "unchanged") {
      if (currentGroup.length > 0 && groupType) {
        const heading = extractHeadingFromLines(diffLines, groupStartIdx);
        const groupId = `group-${groups.length}`;
        let title = "";
        let description = "";
        if (heading) {
          title = `Changes in "${heading}"`;
        } else {
          title = `Changes at lines ${currentGroup[0].oldLineNumber || currentGroup[0].newLineNumber || 0}-${currentGroup[currentGroup.length - 1].oldLineNumber || currentGroup[currentGroup.length - 1].newLineNumber || 0}`;
        }
        const addedLines = currentGroup.filter((l) => l.type === "added").length;
        const removedLines = currentGroup.filter((l) => l.type === "removed").length;
        if (addedLines > 0 && removedLines > 0) {
          description = `Modified ${removedLines} lines, added ${addedLines} lines`;
        } else if (addedLines > 0) {
          description = `Added ${addedLines} lines`;
        } else if (removedLines > 0) {
          description = `Removed ${removedLines} lines`;
        }
        const contextBefore = [];
        const contextAfter = [];
        for (let j = Math.max(0, groupStartIdx - contextLines); j < groupStartIdx; j++) {
          if (diffLines[j].type === "unchanged") {
            contextBefore.push(diffLines[j]);
          }
        }
        for (let j = i; j < Math.min(diffLines.length, i + contextLines); j++) {
          if (diffLines[j].type === "unchanged") {
            contextAfter.push(diffLines[j]);
          }
        }
        groups.push({
          id: groupId,
          type: groupType,
          title,
          description,
          startLine: currentGroup[0].oldLineNumber || currentGroup[0].newLineNumber || 0,
          endLine: currentGroup[currentGroup.length - 1].oldLineNumber || currentGroup[currentGroup.length - 1].newLineNumber || 0,
          lines: currentGroup,
          contextBefore,
          contextAfter,
          selected: true
          // Default to selected
        });
        currentGroup = [];
        groupType = null;
      }
    } else {
      if (currentGroup.length === 0) {
        groupStartIdx = i;
        groupType = line.type === "added" ? "addition" : "deletion";
      } else if (groupType === "addition" && line.type === "removed") {
        groupType = "modification";
      } else if (groupType === "deletion" && line.type === "added") {
        groupType = "modification";
      }
      currentGroup.push(line);
    }
  }
  if (currentGroup.length > 0 && groupType) {
    const heading = extractHeadingFromLines(diffLines, groupStartIdx);
    const groupId = `group-${groups.length}`;
    let title = "";
    let description = "";
    if (heading) {
      title = `Changes in "${heading}"`;
    } else {
      title = `Changes at lines ${currentGroup[0].oldLineNumber || currentGroup[0].newLineNumber || 0}-${currentGroup[currentGroup.length - 1].oldLineNumber || currentGroup[currentGroup.length - 1].newLineNumber || 0}`;
    }
    const addedLines = currentGroup.filter((l) => l.type === "added").length;
    const removedLines = currentGroup.filter((l) => l.type === "removed").length;
    if (addedLines > 0 && removedLines > 0) {
      description = `Modified ${removedLines} lines, added ${addedLines} lines`;
    } else if (addedLines > 0) {
      description = `Added ${addedLines} lines`;
    } else if (removedLines > 0) {
      description = `Removed ${removedLines} lines`;
    }
    const contextBefore = [];
    const contextAfter = [];
    for (let j = Math.max(0, groupStartIdx - contextLines); j < groupStartIdx; j++) {
      if (diffLines[j].type === "unchanged") {
        contextBefore.push(diffLines[j]);
      }
    }
    const groupEndIdx = diffLines.length;
    for (let j = groupEndIdx; j < Math.min(diffLines.length, groupEndIdx + contextLines); j++) {
      if (j < diffLines.length && diffLines[j].type === "unchanged") {
        contextAfter.push(diffLines[j]);
      }
    }
    groups.push({
      id: groupId,
      type: groupType,
      title,
      description,
      startLine: currentGroup[0].oldLineNumber || currentGroup[0].newLineNumber || 0,
      endLine: currentGroup[currentGroup.length - 1].oldLineNumber || currentGroup[currentGroup.length - 1].newLineNumber || 0,
      lines: currentGroup,
      contextBefore,
      contextAfter,
      selected: true
    });
  }
  return groups;
}
function identifyChangeGroups(baseContent, incomingContent) {
  const diff = generateDiff(baseContent, incomingContent);
  return groupConsecutiveChanges(diff.lines);
}
function applySelectedChanges(baseContent, incomingContent, selectedGroups) {
  const diff = generateDiff(baseContent, incomingContent);
  const groups = groupConsecutiveChanges(diff.lines);
  const resultLines = [];
  for (const line of diff.lines) {
    if (line.type === "unchanged") {
      resultLines.push(line.content);
    } else {
      const group = groups.find((g) => g.lines.includes(line));
      if (group && selectedGroups.has(group.id)) {
        if (line.type === "added") {
          resultLines.push(line.content);
        } else if (line.type === "removed") ;
      } else {
        if (line.type === "removed") {
          resultLines.push(line.content);
        }
      }
    }
  }
  return resultLines.join("\n");
}
function MergeView({
  baseContent,
  incomingContent,
  baseTitle,
  incomingTitle,
  onApply,
  onCancel
}) {
  const [changeGroups, setChangeGroups] = React.useState([]);
  const [selectedGroups, setSelectedGroups] = React.useState(/* @__PURE__ */ new Set());
  const [previewContent2, setPreviewContent] = React.useState("");
  const [showMarkdownPreview, setShowMarkdownPreview] = React.useState(false);
  React.useEffect(() => {
    const groups = identifyChangeGroups(baseContent, incomingContent);
    setChangeGroups(groups);
    setSelectedGroups(new Set(groups.map((g) => g.id)));
  }, [baseContent, incomingContent]);
  React.useEffect(() => {
    const merged = applySelectedChanges(baseContent, incomingContent, selectedGroups);
    setPreviewContent(merged);
  }, [baseContent, incomingContent, selectedGroups]);
  const toggleGroup = (groupId) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedGroups(newSelected);
  };
  const selectAll = () => {
    setSelectedGroups(new Set(changeGroups.map((g) => g.id)));
  };
  const deselectAll = () => {
    setSelectedGroups(/* @__PURE__ */ new Set());
  };
  const handleApply = () => {
    const mergedContent = applySelectedChanges(baseContent, incomingContent, selectedGroups);
    onApply(mergedContent);
  };
  const renderDiffLine = (line, idx) => {
    const prefix = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
    const className = line.type === "added" ? styles$1.added : line.type === "removed" ? styles$1.removed : styles$1.unchanged;
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `${styles$1.diffCodeLine} ${className}`, children: [
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.lineNumber, children: line.oldLineNumber || "" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.lineNumber, children: line.newLineNumber || "" }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.linePrefix, children: prefix }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.lineContent, children: line.content || " " })
    ] }, idx);
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.mergeView, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.mergeHeader, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "Merge Changes" }),
      /* @__PURE__ */ jsxRuntime.jsxs("p", { className: styles$1.mergeDescription, children: [
        'Select which changes from "',
        incomingTitle,
        '" to apply to "',
        baseTitle,
        '"'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.mergeActions, children: [
      /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: selectAll, className: styles$1.selectAllButton, children: "Select All" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: deselectAll, className: styles$1.deselectAllButton, children: "Deselect All" }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          onClick: () => setShowMarkdownPreview(!showMarkdownPreview),
          className: styles$1.togglePreviewButton,
          children: showMarkdownPreview ? "Show Diff" : "Show Markdown"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.mergeMainContent, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.changeGroupsColumn, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "Change Groups" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.changeGroupsList, children: changeGroups.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: styles$1.noChanges, children: "No changes to merge" }) : changeGroups.map((group) => /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: `${styles$1.changeGroup} ${selectedGroups.has(group.id) ? styles$1.selected : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.changeGroupHeader, children: /* @__PURE__ */ jsxRuntime.jsxs("label", { className: styles$1.changeGroupLabel, children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: selectedGroups.has(group.id),
                    onChange: () => toggleGroup(group.id),
                    className: styles$1.changeGroupCheckbox
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.changeGroupInfo, children: [
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.changeGroupTitle, children: group.title }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.changeGroupDescription, children: group.description }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${styles$1.changeGroupType} ${styles$1[group.type]}`, children: group.type })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.changeGroupDiff, children: [
                group.contextBefore.map((line, idx) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.contextLine, children: renderDiffLine(line, idx) }, `before-${idx}`)),
                group.lines.map((line, idx) => renderDiffLine(line, idx)),
                group.contextAfter.map((line, idx) => /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.contextLine, children: renderDiffLine(line, idx) }, `after-${idx}`))
              ] })
            ]
          },
          group.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.mergePreviewColumn, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "Preview" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.mergePreviewContent, children: showMarkdownPreview ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.markdownPreview, children: /* @__PURE__ */ jsxRuntime.jsx(MarkdownRenderer, { content: previewContent2 }) }) : /* @__PURE__ */ jsxRuntime.jsx(
          DiffViewer,
          {
            oldContent: baseContent,
            newContent: previewContent2,
            oldTitle: baseTitle,
            newTitle: "Merged Result",
            viewMode: "unified"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.mergeFooter, children: [
      /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: onCancel, className: styles$1.cancelButton, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntime.jsxs(
        "button",
        {
          onClick: handleApply,
          className: styles$1.applyMergeButton,
          disabled: selectedGroups.size === 0,
          children: [
            "Apply Selected Changes (",
            selectedGroups.size,
            " of ",
            changeGroups.length,
            ")"
          ]
        }
      )
    ] })
  ] });
}
function PaperSelectionModal({ papers, onSelect, onCancel }) {
  const [selectedPaper, setSelectedPaper] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredPapers = papers.filter(
    (paper) => paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || paper.abstract.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1e3 * 60 * 60 * 24));
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1e3 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1e3 * 60));
        return `${diffInMinutes} minutes ago`;
      }
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperSelectionOverlay, onClick: onCancel, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperSelectionModal, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperSelectionHeader, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "Select Paper to Merge" }),
      /* @__PURE__ */ jsxRuntime.jsx("button", { className: styles$1.closePaperSelectionButton, onClick: onCancel, children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperSelectionSearch, children: /* @__PURE__ */ jsxRuntime.jsx(
      "input",
      {
        type: "text",
        placeholder: "Search papers...",
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        className: styles$1.paperSearchInput
      }
    ) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperSelectionList, children: filteredPapers.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.noPapersFound, children: "No papers found" }) : filteredPapers.map((paper) => /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: `${styles$1.paperSelectionItem} ${(selectedPaper == null ? void 0 : selectedPaper.id) === paper.id ? styles$1.selected : ""}`,
        onClick: () => setSelectedPaper(paper),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperSelectionTitle, children: paper.title }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperSelectionAbstract, children: paper.abstract.length > 150 ? paper.abstract.substring(0, 150) + "..." : paper.abstract }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperSelectionDate, children: [
            "Last modified: ",
            formatDate(paper.updatedAt)
          ] })
        ]
      },
      paper.id
    )) }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperSelectionFooter, children: [
      /* @__PURE__ */ jsxRuntime.jsx("button", { onClick: onCancel, className: styles$1.cancelButton, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          onClick: () => selectedPaper && onSelect(selectedPaper),
          className: styles$1.selectPaperButton,
          disabled: !selectedPaper,
          children: "Select Paper"
        }
      )
    ] })
  ] }) });
}
function AiFeedbackModal({
  isOpen,
  onClose,
  content,
  title,
  abstract,
  paperId,
  onFeedbackGenerated
}) {
  const [feedbackType2, setFeedbackType] = React.useState("research");
  const [selectedText, setSelectedText] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [error2, setError] = React.useState("");
  const [showSettings, setShowSettings] = React.useState(false);
  const [feedbackHistory2, setFeedbackHistory] = React.useState([]);
  const [showHistory, setShowHistory] = React.useState(false);
  const [aiSettings2, setAiSettings] = React.useState(() => {
    const saved2 = localStorage.getItem("aiSettings");
    if (saved2) {
      try {
        return JSON.parse(saved2);
      } catch {
        return { provider: "anthropic", apiKey: "" };
      }
    }
    return { provider: "anthropic", apiKey: "" };
  });
  React.useEffect(() => {
    if (isOpen && window.getSelection) {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        setSelectedText(selection.toString());
      }
    }
    if (isOpen && paperId) {
      loadFeedbackHistory();
    }
  }, [isOpen, paperId]);
  const loadFeedbackHistory = async () => {
    if (!paperId) return;
    try {
      const response = await api.get(`/ai/feedback/history/${paperId}`);
      setFeedbackHistory(response.feedbackHistory || []);
    } catch (error22) {
      console.error("Failed to load feedback history:", error22);
    }
  };
  React.useEffect(() => {
    localStorage.setItem("aiSettings", JSON.stringify(aiSettings2));
  }, [aiSettings2]);
  const handleGenerateFeedback = async () => {
    if (!aiSettings2.apiKey) {
      setShowSettings(true);
      setError("Please configure your AI API key first");
      return;
    }
    setIsGenerating(true);
    setError("");
    setFeedback("");
    try {
      const textToReview = selectedText || content;
      const useMockData = !aiSettings2.apiKey || aiSettings2.apiKey === "demo";
      if (useMockData) {
        const context = {
          title,
          abstract,
          fullContent: content,
          selectedText: selectedText || null
        };
        const mockFeedback = generateMockFeedback(feedbackType2, textToReview, context);
        await new Promise((resolve) => setTimeout(resolve, 2e3));
        setFeedback(mockFeedback);
        if (onFeedbackGenerated) {
          onFeedbackGenerated(mockFeedback);
        }
      } else {
        const response = await api.post("/ai/feedback", {
          content: textToReview,
          feedbackType: feedbackType2,
          provider: aiSettings2.provider,
          apiKey: aiSettings2.apiKey,
          context: {
            title,
            abstract,
            fullContent: content,
            selectedText: selectedText || null,
            paperId: paperId || void 0
          }
        });
        setFeedback(response.feedback);
        if (onFeedbackGenerated) {
          onFeedbackGenerated(response.feedback);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate feedback");
    } finally {
      setIsGenerating(false);
    }
  };
  const generateMockFeedback = (type, _text, context) => {
    const feedbackTemplates = {
      research: `## Research Development Insights

**Your Core Contribution:**
I see you're exploring ${context.title}. This is a fascinating area that connects to several emerging discussions in the field.

**Potential Research Directions:**
- Have you considered how this relates to recent work by Chen et al. (2024) on distributed systems? Their framework might complement your approach
- Your methodology could be extended to examine edge cases in quantum computing applications
- There's an interesting parallel with complexity theory that might strengthen your theoretical foundation

**Questions to Deepen Your Analysis:**
1. What would happen if we applied your framework to real-world scenarios at scale?
2. How might your findings challenge existing assumptions in the field?
3. Could this approach be generalized to other domains?

**Collaborative Next Steps:**
Let's explore how your work fits into the broader research landscape. I notice potential connections to game theory and network effects that could add another dimension to your analysis.`,
      methodology: `## Methodology Collaboration

**Current Approach Strengths:**
Your methodology shows careful consideration of variables and controls. The experimental design is thoughtful.

**Let's Strengthen Your Methods:**
- Consider a mixed-methods approach combining your quantitative analysis with qualitative interviews
- The sample size calculations could benefit from power analysis - shall we work through this together?
- Your control variables are good, but we might also consider temporal factors

**Alternative Methodological Frameworks:**
1. **Bayesian Approach**: Could offer more nuanced uncertainty quantification
2. **Longitudinal Design**: Might capture evolution of your phenomenon over time
3. **Comparative Case Study**: Could provide deeper contextual insights

**State-of-the-Art Techniques:**
Recent papers at ICML 2024 introduced new statistical methods for similar problems. Would you like to explore how these might apply to your research?`,
      analysis: `## Analytical Framework Development

**Your Current Analysis:**
I appreciate the depth of your analytical approach. You're touching on some fundamental questions here.

**Deepening the Analysis:**
- Your data suggests patterns that might be explained by network effects theory
- Have you considered applying topological data analysis to uncover hidden structures?
- The interaction effects you've identified could be modeled using recent advances in causal inference

**Critical Questions:**
1. What assumptions underlie your analytical model, and how might we test them?
2. Are there alternative explanations for your findings we should explore?
3. How robust are your results to different analytical approaches?

**Cutting-Edge Analytical Tools:**
- Graph neural networks could reveal complex relationships in your data
- Information-theoretic measures might quantify the relationships you're observing
- Recent work on interpretable ML could help explain your black-box models`,
      literature: `## Literature & Research Connections

**Your Work in Context:**
Your research builds nicely on foundational work while pushing into new territory. Let me help you situate this in the broader conversation.

**Key Connections to Explore:**
- **Theoretical Lineage**: Your approach extends Smith (2019) but challenges Johnson (2021) - this tension is productive
- **Interdisciplinary Links**: Economics literature on mechanism design offers useful parallels
- **Emerging Debates**: Your work speaks to the ongoing discussion about replicability in Nature (2024)

**Underexplored Literature:**
1. The European school has relevant work that's often overlooked in English literature
2. Recent preprints on arXiv suggest similar investigations are happening in parallel
3. Historical perspectives from the 1970s might offer surprising insights

**Synthesis Opportunities:**
By connecting your findings to complexity science and information theory, you could bridge multiple research communities. Shall we explore these connections?`,
      innovation: `## Innovation & Impact Exploration

**Novel Contributions I See:**
Your work introduces a fresh perspective on ${context.title}. This is genuinely innovative in how it reframes the problem.

**Potential Breakthrough Areas:**
- Your approach could fundamentally change how we think about resource allocation in distributed systems
- The theoretical framework you're developing might apply far beyond your immediate domain
- I see potential for a new research paradigm emerging from your insights

**Impact Amplification:**
1. **Immediate Applications**: Tech companies could implement this tomorrow
2. **Policy Implications**: Your findings suggest need for regulatory framework updates
3. **Future Research**: You're opening at least three new research directions

**Pushing the Boundaries:**
What if we took your core insight and applied it recursively? This could lead to a general theory of adaptive systems. Recent Nobel work in physics used similar recursive approaches to great effect.

**Collaborative Innovation:**
Let's brainstorm how your work might combine with recent advances in quantum computing and biological systems. The convergence could be transformative.`
    };
    return feedbackTemplates[type];
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.modalOverlay, onClick: (e) => {
    if (e.target === e.currentTarget) onClose();
  }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.aiFeedbackModal, children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.modalHeader, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "Research Collaborator" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.modalHeaderActions, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.historyButton,
            onClick: () => setShowHistory(!showHistory),
            title: "View feedback history",
            children: showHistory ? "Notes" : "History"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("button", { className: styles$1.modalClose, onClick: onClose, children: "×" })
      ] })
    ] }),
    showSettings ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.aiSettings, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "AI Provider Settings" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { children: "Select AI Provider:" }),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "select",
          {
            value: aiSettings2.provider,
            onChange: (e) => setAiSettings({ ...aiSettings2, provider: e.target.value }),
            className: styles$1.aiProviderSelect,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "anthropic", children: "Anthropic (Claude)" }),
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "openai", children: "OpenAI (GPT-4)" }),
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "grok", children: "Grok" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { children: "API Key:" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            type: "password",
            value: aiSettings2.apiKey,
            onChange: (e) => setAiSettings({ ...aiSettings2, apiKey: e.target.value }),
            placeholder: `Enter your ${aiSettings2.provider} API key`,
            className: styles$1.apiKeyInput
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("small", { className: styles$1.apiKeyHint, children: 'Your API key is stored locally and never sent to our servers. Use "demo" as the API key to try with sample feedback.' })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.settingsActions, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.saveSettingsButton,
            onClick: () => setShowSettings(false),
            disabled: !aiSettings2.apiKey,
            children: "Save Settings"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.cancelButton,
            onClick: () => setShowSettings(false),
            children: "Cancel"
          }
        )
      ] })
    ] }) : showHistory ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.feedbackHistory, children: [
      /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "Previous Research Collaborations" }),
      feedbackHistory2.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("p", { className: styles$1.noHistory, children: "No previous feedback for this paper yet." }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.historyList, children: feedbackHistory2.map((item) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.historyItem, children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.historyHeader, children: /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.historyDate, children: new Date(item.createdAt).toLocaleDateString() }) }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.historyContent, children: [
          item.feedback.split("\n").slice(0, 3).join("\n"),
          "..."
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.historyViewButton,
            onClick: () => {
              setFeedback(item.feedback);
              setShowHistory(false);
            },
            children: "View Full Feedback"
          }
        )
      ] }, item.id)) })
    ] }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.feedbackOptions, children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: styles$1.feedbackPrompt, children: selectedText ? `Let's explore this passage together` : "Choose how I can help advance your research" }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.feedbackTypes, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("label", { className: `${styles$1.feedbackType} ${feedbackType2 === "research" ? styles$1.active : ""}`, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "radio",
                name: "feedbackType",
                value: "research",
                checked: feedbackType2 === "research",
                onChange: (e) => setFeedbackType(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Research Development" }),
            /* @__PURE__ */ jsxRuntime.jsx("small", { children: "Expand ideas & explore new directions" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("label", { className: `${styles$1.feedbackType} ${feedbackType2 === "methodology" ? styles$1.active : ""}`, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "radio",
                name: "feedbackType",
                value: "methodology",
                checked: feedbackType2 === "methodology",
                onChange: (e) => setFeedbackType(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Methodology Review" }),
            /* @__PURE__ */ jsxRuntime.jsx("small", { children: "Strengthen research approach" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("label", { className: `${styles$1.feedbackType} ${feedbackType2 === "analysis" ? styles$1.active : ""}`, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "radio",
                name: "feedbackType",
                value: "analysis",
                checked: feedbackType2 === "analysis",
                onChange: (e) => setFeedbackType(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Analysis & Insights" }),
            /* @__PURE__ */ jsxRuntime.jsx("small", { children: "Deepen analytical framework" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("label", { className: `${styles$1.feedbackType} ${feedbackType2 === "literature" ? styles$1.active : ""}`, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "radio",
                name: "feedbackType",
                value: "literature",
                checked: feedbackType2 === "literature",
                onChange: (e) => setFeedbackType(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Literature Connections" }),
            /* @__PURE__ */ jsxRuntime.jsx("small", { children: "Connect to broader research" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("label", { className: `${styles$1.feedbackType} ${feedbackType2 === "innovation" ? styles$1.active : ""}`, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                type: "radio",
                name: "feedbackType",
                value: "innovation",
                checked: feedbackType2 === "innovation",
                onChange: (e) => setFeedbackType(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Innovation & Impact" }),
            /* @__PURE__ */ jsxRuntime.jsx("small", { children: "Identify novel contributions" })
          ] })
        ] })
      ] }),
      error2 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.feedbackError, children: error2 }),
      feedback && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.feedbackResult, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.feedbackContent, children: feedback.split("\n").map((line, i) => {
        if (line.startsWith("##")) {
          return /* @__PURE__ */ jsxRuntime.jsx("h3", { children: line.replace("##", "").trim() }, i);
        } else if (line.startsWith("**") && line.endsWith("**")) {
          return /* @__PURE__ */ jsxRuntime.jsx("strong", { children: line.replace(/\*\*/g, "") }, i);
        } else if (line.startsWith("-") || line.startsWith("•")) {
          return /* @__PURE__ */ jsxRuntime.jsx("li", { children: line.substring(1).trim() }, i);
        } else if (line.match(/^\d+\./)) {
          return /* @__PURE__ */ jsxRuntime.jsx("li", { children: line }, i);
        } else if (line.trim()) {
          return /* @__PURE__ */ jsxRuntime.jsx("p", { children: line }, i);
        }
        return null;
      }) }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.feedbackActions, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.generateButton,
            onClick: handleGenerateFeedback,
            disabled: isGenerating,
            children: isGenerating ? "Thinking..." : "Collaborate"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.settingsButton,
            onClick: () => setShowSettings(true),
            children: "Settings"
          }
        )
      ] })
    ] })
  ] }) });
}
function EditorPage() {
  var _a, _b, _c, _d, _e, _f, _g;
  const { id } = reactRouterDom.useParams();
  const navigate = reactRouterDom.useNavigate();
  const [paper, setPaper] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [abstract, setAbstract] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tags2, setTags] = React.useState("");
  const [showPublishModal, setShowPublishModal] = React.useState(false);
  const [selectedVersionId, setSelectedVersionId] = React.useState(null);
  const [selectedVersionDetails, setSelectedVersionDetails] = React.useState(null);
  const [loadingVersionDetails, setLoadingVersionDetails] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [publishedVersions, setPublishedVersions] = React.useState([]);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [publishedUrl, setPublishedUrl] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [, setSaving] = React.useState(false);
  const [error2, setError] = React.useState("");
  const [showMetadata, setShowMetadata] = React.useState(false);
  const [showRevisions, setShowRevisions] = React.useState(false);
  const [revisions, setRevisions] = React.useState([]);
  const [loadingRevisions2, setLoadingRevisions] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState(null);
  const [saveStatus2, setSaveStatus] = React.useState("saved");
  const lastSavedIntervalRef = React.useRef(null);
  const [timeSinceLastSave, setTimeSinceLastSave] = React.useState("");
  const hasUnsavedChanges = React.useRef(false);
  const [headerHovered, setHeaderHovered] = React.useState(false);
  const [previewRevision, setPreviewRevision] = React.useState(null);
  const [compareRevision, setCompareRevision] = React.useState(null);
  const [showDiffView, setShowDiffView] = React.useState(false);
  const [showCreateVersionModal, setShowCreateVersionModal] = React.useState(false);
  const [versionMessage2, setVersionMessage] = React.useState("");
  const [showMergeModal, setShowMergeModal] = React.useState(false);
  const [mergeSourcePaper, setMergeSourcePaper] = React.useState(null);
  const [showPaperSelection, setShowPaperSelection] = React.useState(false);
  const [availablePapers, setAvailablePapers] = React.useState([]);
  const [viewMode, setViewMode] = React.useState("split");
  const [selectedFont, setSelectedFont] = React.useState(
    () => localStorage.getItem("editorFont") || "golos"
  );
  const [fontSize, setFontSize] = React.useState(
    () => parseInt(localStorage.getItem("editorFontSize") || "18")
  );
  const [showToolbar, setShowToolbar] = React.useState(false);
  const [showInsertMenu, setShowInsertMenu] = React.useState(false);
  const [insertMenuPosition, setInsertMenuPosition] = React.useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = React.useState(false);
  const [contextMenuPosition, setContextMenuPosition] = React.useState({ x: 0, y: 0 });
  const [showImageDialog, setShowImageDialog] = React.useState(false);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [showAiFeedback, setShowAiFeedback] = React.useState(false);
  const textareaRef = React.useRef(null);
  const editorPaneRef = React.useRef(null);
  const previewPaneRef = React.useRef(null);
  const isScrollSyncingRef = React.useRef(false);
  const toolbarRef = React.useRef(null);
  const insertRef = React.useRef(null);
  const contextMenuRef = React.useRef(null);
  const { addToHistory, undo, redo, canUndo, canRedo, reset } = useUndoRedo(content);
  const fontCategories = {
    "Sans-serif": [
      { value: "inter", label: "Inter", family: "'Inter', sans-serif" },
      { value: "open-sans", label: "Open Sans", family: "'Open Sans', sans-serif" },
      { value: "poppins", label: "Poppins", family: "'Poppins', sans-serif" },
      { value: "raleway", label: "Raleway", family: "'Raleway', sans-serif" },
      { value: "montserrat", label: "Montserrat", family: "'Montserrat', sans-serif" },
      { value: "work-sans", label: "Work Sans", family: "'Work Sans', sans-serif" },
      { value: "source-sans", label: "Source Sans 3", family: "'Source Sans 3', sans-serif" },
      { value: "ibm-plex", label: "IBM Plex Sans", family: "'IBM Plex Sans', sans-serif" },
      { value: "system", label: "System Default", family: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }
    ],
    "Serif": [
      { value: "merriweather", label: "Merriweather", family: "'Merriweather', serif" },
      { value: "playfair", label: "Playfair Display", family: "'Playfair Display', serif" },
      { value: "lora", label: "Lora", family: "'Lora', serif" },
      { value: "crimson", label: "Crimson Text", family: "'Crimson Text', serif" },
      { value: "noto-serif", label: "Noto Serif", family: "'Noto Serif', serif" },
      { value: "eb-garamond", label: "EB Garamond", family: "'EB Garamond', serif" },
      { value: "libre-baskerville", label: "Libre Baskerville", family: "'Libre Baskerville', serif" },
      { value: "roboto-slab", label: "Roboto Slab", family: "'Roboto Slab', serif" }
    ],
    "Monospace": [
      { value: "golos", label: "Golos Text", family: "'Golos Text', monospace" },
      { value: "jetbrains", label: "JetBrains Mono", family: "'JetBrains Mono', monospace" },
      { value: "fira-code", label: "Fira Code", family: "'Fira Code', monospace" },
      { value: "mono", label: "System Mono", family: '"SF Mono", Monaco, Consolas, monospace' }
    ]
  };
  const allFonts = Object.values(fontCategories).flat();
  const markdownTemplates = [
    { label: "Link", template: "[link text](https://example.com)", cursor: 1 },
    { label: "Image", template: "![alt text](image-url.jpg)", cursor: 2 },
    { label: "Image (HTML)", template: "custom", cursor: 0, action: () => {
      setShowImageDialog(true);
      setShowInsertMenu(false);
      setInsertMenuPosition({ x: 0, y: 0 });
    } },
    { label: "Bold", template: "**bold text**", cursor: 2 },
    { label: "Italic", template: "*italic text*", cursor: 1 },
    { label: "Code Block", template: "```language\ncode here\n```", cursor: 3 },
    { label: "Inline Code", template: "`code`", cursor: 1 },
    { label: "Heading 1", template: "# Heading 1", cursor: 2 },
    { label: "Heading 2", template: "## Heading 2", cursor: 3 },
    { label: "Heading 3", template: "### Heading 3", cursor: 4 },
    { label: "Bullet List", template: "- Item 1\n- Item 2\n- Item 3", cursor: 2 },
    { label: "Numbered List", template: "1. Item 1\n2. Item 2\n3. Item 3", cursor: 3 },
    { label: "Blockquote", template: "> Quote text", cursor: 2 },
    { label: "Horizontal Rule", template: "---", cursor: 3 },
    { label: "Table", template: "| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |", cursor: 2 },
    { label: "Task List", template: "- [ ] Task 1\n- [ ] Task 2\n- [x] Completed task", cursor: 6 }
  ];
  React.useEffect(() => {
    if (id) {
      api.get(`/papers/user/papers`).then(({ papers }) => {
        const paper2 = papers.find((p) => p.id === id);
        if (paper2) {
          setPaper(paper2);
          setTitle(paper2.title);
          setAbstract(paper2.abstract);
          const paperContent = paper2.content || "";
          setContent(paperContent);
          reset(paperContent);
          setTags(paper2.tags.join(", "));
          if (paper2.font) {
            setSelectedFont(paper2.font);
          }
          setLastSaved(/* @__PURE__ */ new Date());
          setSaveStatus("saved");
        }
      }).catch((err) => setError(err.message));
    }
  }, [id]);
  React.useEffect(() => {
    localStorage.setItem("editorFont", selectedFont);
  }, [selectedFont]);
  React.useEffect(() => {
    localStorage.setItem("editorFontSize", fontSize.toString());
  }, [fontSize]);
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showInsertMenu && insertRef.current && !insertRef.current.contains(event.target) && !event.target.closest(`.${styles$1.insertToggle}`)) {
        setShowInsertMenu(false);
        setInsertMenuPosition({ x: 0, y: 0 });
      }
      if (showToolbar && toolbarRef.current && !toolbarRef.current.contains(event.target) && !event.target.closest(`.${styles$1.toolbarToggle}`)) {
        setShowToolbar(false);
      }
      if (showContextMenu && contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInsertMenu, showToolbar, showContextMenu]);
  const handleContextMenu = React.useCallback((e) => {
    e.preventDefault();
    const menuWidth = 220;
    const menuHeight = 320;
    const padding = 10;
    let x = e.clientX;
    let y = e.clientY;
    if (x + menuWidth > window.innerWidth - padding) {
      x = window.innerWidth - menuWidth - padding;
    }
    if (y + menuHeight > window.innerHeight - padding) {
      y = window.innerHeight - menuHeight - padding;
    }
    setContextMenuPosition({ x, y });
    setShowContextMenu(true);
  }, []);
  const insertTemplate = (template, cursorOffset) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setShowInsertMenu(false);
    setInsertMenuPosition({ x: 0, y: 0 });
    const newContent = content.substring(0, start) + template + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
      addToHistory(newContent, newPosition, newPosition);
    }, 0);
  };
  const handleFileUpload = (content2, filename) => {
    setContent(content2);
    if (!id && filename) {
      const titleFromFilename = filename.replace(/\.(md|txt|docx)$/i, "");
      setTitle(titleFromFilename);
    }
    if (textareaRef.current) {
      reset(content2);
      setSaveStatus("unsaved");
    }
  };
  const handleDownload = () => {
    const filename = title || "untitled";
    downloadMarkdown(content, filename);
  };
  const handleImageInsert = (html) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + html + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + html.length;
      textarea.setSelectionRange(newPosition, newPosition);
      addToHistory(newContent, newPosition, newPosition);
    }, 0);
  };
  const handleUndo = React.useCallback(() => {
    const historyState = undo();
    if (historyState && textareaRef.current) {
      setContent(historyState.value);
      setTimeout(() => {
        var _a2, _b2;
        (_a2 = textareaRef.current) == null ? void 0 : _a2.setSelectionRange(historyState.selectionStart, historyState.selectionEnd);
        (_b2 = textareaRef.current) == null ? void 0 : _b2.focus();
      }, 0);
    }
  }, [undo]);
  const handleRedo = React.useCallback(() => {
    const historyState = redo();
    if (historyState && textareaRef.current) {
      setContent(historyState.value);
      setTimeout(() => {
        var _a2, _b2;
        (_a2 = textareaRef.current) == null ? void 0 : _a2.setSelectionRange(historyState.selectionStart, historyState.selectionEnd);
        (_b2 = textareaRef.current) == null ? void 0 : _b2.focus();
      }, 0);
    }
  }, [redo]);
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "z" && e.shiftKey || e.key === "y")) {
        e.preventDefault();
        handleRedo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        if (showInsertMenu) {
          setShowInsertMenu(false);
          setInsertMenuPosition({ x: 0, y: 0 });
        } else {
          if (textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.focus();
            const measureDiv = document.createElement("div");
            measureDiv.style.position = "absolute";
            measureDiv.style.visibility = "hidden";
            measureDiv.style.whiteSpace = "pre-wrap";
            measureDiv.style.font = window.getComputedStyle(textarea).font;
            measureDiv.style.padding = window.getComputedStyle(textarea).padding;
            measureDiv.style.width = textarea.clientWidth + "px";
            const textBeforeCursor = textarea.value.substring(0, textarea.selectionStart);
            measureDiv.textContent = textBeforeCursor;
            document.body.appendChild(measureDiv);
            const rect = textarea.getBoundingClientRect();
            const scrollTop = textarea.scrollTop;
            const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
            const lines = textBeforeCursor.split("\n");
            const currentLineNumber = lines.length;
            const currentLineText = lines[lines.length - 1];
            const lineSpan = document.createElement("span");
            lineSpan.textContent = currentLineText;
            measureDiv.innerHTML = "";
            measureDiv.appendChild(lineSpan);
            const lineWidth = lineSpan.offsetWidth;
            const cursorTop = rect.top + (currentLineNumber - 1) * lineHeight - scrollTop + 20;
            const cursorLeft = rect.left + Math.min(lineWidth + 20, rect.width - 300);
            document.body.removeChild(measureDiv);
            setInsertMenuPosition({ x: cursorLeft, y: cursorTop });
            setShowInsertMenu(true);
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleUndo, handleRedo, showInsertMenu]);
  React.useEffect(() => {
    if (viewMode !== "split") return;
    const handleEditorScroll = () => {
      if (isScrollSyncingRef.current) return;
      if (!editorPaneRef.current || !previewPaneRef.current) return;
      isScrollSyncingRef.current = true;
      const editorScrollTop = editorPaneRef.current.scrollTop;
      const editorScrollHeight = editorPaneRef.current.scrollHeight - editorPaneRef.current.clientHeight;
      const scrollPercentage = editorScrollHeight > 0 ? editorScrollTop / editorScrollHeight : 0;
      const previewScrollHeight = previewPaneRef.current.scrollHeight - previewPaneRef.current.clientHeight;
      previewPaneRef.current.scrollTop = scrollPercentage * previewScrollHeight;
      setTimeout(() => {
        isScrollSyncingRef.current = false;
      }, 50);
    };
    const handlePreviewScroll = () => {
      if (isScrollSyncingRef.current) return;
      if (!editorPaneRef.current || !previewPaneRef.current) return;
      isScrollSyncingRef.current = true;
      const previewScrollTop = previewPaneRef.current.scrollTop;
      const previewScrollHeight = previewPaneRef.current.scrollHeight - previewPaneRef.current.clientHeight;
      const scrollPercentage = previewScrollHeight > 0 ? previewScrollTop / previewScrollHeight : 0;
      const editorScrollHeight = editorPaneRef.current.scrollHeight - editorPaneRef.current.clientHeight;
      editorPaneRef.current.scrollTop = scrollPercentage * editorScrollHeight;
      setTimeout(() => {
        isScrollSyncingRef.current = false;
      }, 50);
    };
    const editorPane2 = editorPaneRef.current;
    const previewPane2 = previewPaneRef.current;
    if (editorPane2) {
      editorPane2.addEventListener("scroll", handleEditorScroll, { passive: true });
    }
    if (previewPane2) {
      previewPane2.addEventListener("scroll", handlePreviewScroll, { passive: true });
    }
    return () => {
      if (editorPane2) {
        editorPane2.removeEventListener("scroll", handleEditorScroll);
      }
      if (previewPane2) {
        previewPane2.removeEventListener("scroll", handlePreviewScroll);
      }
    };
  }, [viewMode]);
  React.useEffect(() => {
    if ((showRevisions || showPublishModal) && paper) {
      setLoadingRevisions(true);
      api.get(`/papers/${paper.id}/revisions`).then(({ revisions: revisions2 }) => setRevisions(revisions2)).catch((err) => setError(err.message)).finally(() => setLoadingRevisions(false));
    }
  }, [showRevisions, showPublishModal, paper]);
  React.useEffect(() => {
    if (paper) {
      api.get(`/papers/${paper.id}/published`).then(({ publishedVersions: publishedVersions2 }) => setPublishedVersions(publishedVersions2)).catch((err) => console.error("Failed to load published versions:", err));
    }
  }, [paper]);
  React.useEffect(() => {
    const updateTimeSinceLastSave = () => {
      if (lastSaved) {
        const now = /* @__PURE__ */ new Date();
        const diff = now.getTime() - lastSaved.getTime();
        const seconds = Math.floor(diff / 1e3);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
          setTimeSinceLastSave(`${hours}h ago`);
        } else if (minutes > 0) {
          setTimeSinceLastSave(`${minutes}m ago`);
        } else if (seconds > 5) {
          setTimeSinceLastSave(`${seconds}s ago`);
        } else {
          setTimeSinceLastSave("just now");
        }
      }
    };
    updateTimeSinceLastSave();
    lastSavedIntervalRef.current = setInterval(updateTimeSinceLastSave, 5e3);
    return () => {
      if (lastSavedIntervalRef.current) {
        clearInterval(lastSavedIntervalRef.current);
      }
    };
  }, [lastSaved]);
  const performSave = React.useCallback(async () => {
    if (!hasUnsavedChanges.current) return;
    setSaveStatus("saving");
    setSaving(true);
    try {
      const effectiveTitle = title || generateTitleFromContent(content);
      const paperData = {
        title: effectiveTitle,
        abstract,
        content,
        tags: tags2.split(",").map((t) => t.trim()).filter(Boolean),
        font: selectedFont
      };
      if (paper) {
        const updateData = { ...paperData };
        const { paper: updated } = await api.put(`/papers/${paper.id}`, updateData);
        setPaper(updated);
      } else {
        const createData = paperData;
        const { paper: created } = await api.post("/papers", createData);
        setPaper(created);
        navigate(`/editor/${created.id}`, { replace: true });
      }
      setLastSaved(/* @__PURE__ */ new Date());
      setSaveStatus("saved");
      hasUnsavedChanges.current = false;
      setError("");
    } catch (err) {
      setError(err.message);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }, [title, abstract, content, tags2, paper, navigate, selectedFont]);
  const onSaveRef = React.useRef(performSave);
  onSaveRef.current = performSave;
  const debouncedSave = React.useMemo(
    () => lodash.debounce(() => onSaveRef.current(), 2e3),
    []
  );
  React.useEffect(() => {
    if (paper || content) {
      hasUnsavedChanges.current = true;
      setSaveStatus("unsaved");
      debouncedSave();
    }
  }, [title, abstract, content, tags2]);
  const handleRestoreRevision = async (revisionId) => {
    if (!paper) return;
    try {
      const { paper: restored } = await api.post(`/papers/${paper.id}/revisions/${revisionId}/restore`);
      setPaper(restored);
      setTitle(restored.title);
      setAbstract(restored.abstract);
      const restoredContent = restored.content || "";
      setContent(restoredContent);
      reset(restoredContent);
      setTags(restored.tags.join(", "));
      setShowRevisions(false);
      const { revisions: revisions2 } = await api.get(`/papers/${paper.id}/revisions`);
      setRevisions(revisions2);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleViewRevision = async (revisionId) => {
    if (!paper) return;
    try {
      const { revision } = await api.get(`/papers/${paper.id}/revisions/${revisionId}`);
      setPreviewRevision(revision);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleCompareRevision = async (revisionId) => {
    if (!paper) return;
    try {
      const { revision } = await api.get(`/papers/${paper.id}/revisions/${revisionId}`);
      setCompareRevision(revision);
      setShowDiffView(true);
      setShowRevisions(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleCreateVersion = async () => {
    if (!paper || !versionMessage2.trim()) return;
    try {
      await api.post(`/papers/${paper.id}/revisions`, { message: versionMessage2 });
      setShowCreateVersionModal(false);
      setVersionMessage("");
      const { revisions: revisions2 } = await api.get(`/papers/${paper.id}/revisions`);
      setRevisions(revisions2);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleApplyMerge = (mergedContent) => {
    setContent(mergedContent);
    setShowMergeModal(false);
    setMergeSourcePaper(null);
  };
  const handleStartMerge = async () => {
    try {
      const { papers } = await api.get("/papers/user/papers");
      const otherPapers = papers.filter((p) => p.id !== (paper == null ? void 0 : paper.id));
      if (otherPapers.length === 0) {
        setError("No other papers available to merge from");
        return;
      }
      setAvailablePapers(otherPapers);
      setShowPaperSelection(true);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleSelectPaperForMerge = (selectedPaper) => {
    setMergeSourcePaper(selectedPaper);
    setShowPaperSelection(false);
    setShowMergeModal(true);
  };
  const handleVersionSelect = async (versionId) => {
    setSelectedVersionId(versionId);
    if (versionId === "current") {
      setSelectedVersionDetails({
        title,
        abstract,
        content,
        tags: tags2.split(",").map((t) => t.trim()).filter(Boolean)
      });
    } else if (paper) {
      setLoadingVersionDetails(true);
      try {
        const { revision } = await api.get(`/papers/${paper.id}/revisions/${versionId}`);
        setSelectedVersionDetails({
          title: revision.title,
          abstract: revision.abstract,
          content: revision.content || "",
          tags: revision.tags || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingVersionDetails(false);
      }
    }
  };
  const getSaveStatusDisplay = () => {
    switch (saveStatus2) {
      case "saving":
        return "Saving...";
      case "saved":
        return lastSaved ? `Saved ${timeSinceLastSave}` : "Saved";
      case "error":
        return "Save failed";
      case "unsaved":
        return "Unsaved changes";
      default:
        return "";
    }
  };
  const generateTitleFromContent = (content2) => {
    const trimmedContent = content2.trim();
    if (!trimmedContent) {
      return "Untitled";
    }
    const lines = trimmedContent.split("\n");
    let firstLine = "";
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        firstLine = trimmedLine.replace(/^#+\s*/, "");
        break;
      }
    }
    if (!firstLine) {
      return "Untitled";
    }
    const words = firstLine.split(/\s+/);
    const titleWords = words.slice(0, 5);
    let generatedTitle = titleWords.join(" ");
    if (words.length > 5) {
      generatedTitle += "...";
    }
    if (generatedTitle.length > 50) {
      generatedTitle = generatedTitle.substring(0, 47) + "...";
    }
    return generatedTitle;
  };
  const formatRevisionDate = (dateString) => {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
    if (days === 0) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.fullPageEditor, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        className: styles$1.editorHeader,
        onMouseEnter: () => setHeaderHovered(true),
        onMouseLeave: () => setHeaderHovered(false),
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `${styles$1.editorHeaderLeft} ${headerHovered ? styles$1.visible : styles$1.hidden}`, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                className: styles$1.titleInput,
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "Untitled (auto-generated from content)"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${styles$1.saveStatus} ${styles$1[saveStatus2]}`, children: getSaveStatusDisplay() })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.editorHeaderCenter, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                className: styles$1.viewModeToggle,
                onClick: () => setViewMode(viewMode === "split" ? "focused" : "split"),
                title: viewMode === "split" ? "Focus mode" : "Split view",
                children: viewMode === "split" ? "⚟" : "⚏"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                className: styles$1.toolbarToggle,
                onClick: () => setShowToolbar(!showToolbar),
                title: "Text formatting",
                children: "Aa"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                className: styles$1.insertToggle,
                onClick: () => setShowInsertMenu(!showInsertMenu),
                title: "Insert Markdown",
                children: "+"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `${styles$1.editorHeaderRight} ${headerHovered ? styles$1.visible : styles$1.hidden}`, children: [
            headerHovered && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  className: styles$1.uploadButton,
                  onClick: () => setShowUploadModal(true),
                  title: "Upload markdown (.md), text (.txt), or Word (.docx) file",
                  children: "Upload"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  className: styles$1.downloadButton,
                  onClick: handleDownload,
                  title: "Download as markdown file",
                  children: "Download"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  className: styles$1.metadataToggle,
                  onClick: () => setShowMetadata(!showMetadata),
                  children: "Details"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  className: styles$1.metadataToggle,
                  onClick: () => setShowRevisions(!showRevisions),
                  children: "History"
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  className: styles$1.mergeButton,
                  onClick: handleStartMerge,
                  children: "Merge"
                }
              ),
              paper && /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  className: styles$1.publishButton,
                  onClick: () => {
                    setShowPublishModal(true);
                    handleVersionSelect("current");
                  },
                  children: "Publish"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Link, { to: "/dashboard", className: styles$1.exitButton, children: "✕" })
          ] }),
          showToolbar && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.toolbarPopoverContainer, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: toolbarRef, className: styles$1.toolbarPopover, children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.toolbarSection, children: [
              /* @__PURE__ */ jsxRuntime.jsx("h3", { className: styles$1.toolbarSectionTitle, children: "Text Formatting" }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.toolbarRow, children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    className: styles$1.undoButton,
                    onClick: handleUndo,
                    disabled: !canUndo,
                    title: "Undo (Cmd/Ctrl + Z)",
                    children: "↶"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    className: styles$1.redoButton,
                    onClick: handleRedo,
                    disabled: !canRedo,
                    title: "Redo (Cmd/Ctrl + Shift + Z)",
                    children: "↷"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.toolbarDivider }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.sizeControls, children: [
                  /* @__PURE__ */ jsxRuntime.jsx(
                    "button",
                    {
                      className: styles$1.sizeButton,
                      onClick: () => setFontSize(Math.max(12, fontSize - 2)),
                      disabled: fontSize <= 12,
                      children: "−"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.sizeDisplay, children: [
                    fontSize,
                    "px"
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    "button",
                    {
                      className: styles$1.sizeButton,
                      onClick: () => setFontSize(Math.min(32, fontSize + 2)),
                      disabled: fontSize >= 32,
                      children: "+"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.toolbarSection, children: [
              /* @__PURE__ */ jsxRuntime.jsx("h3", { className: styles$1.toolbarSectionTitle, children: "Font Family" }),
              Object.entries(fontCategories).map(([category, fonts]) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.fontCategory, children: [
                /* @__PURE__ */ jsxRuntime.jsx("h4", { className: styles$1.fontCategoryTitle, children: category }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.fontGrid, children: fonts.map((font) => /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    className: `${styles$1.fontOption} ${selectedFont === font.value ? styles$1.selected : ""}`,
                    onClick: () => {
                      setSelectedFont(font.value);
                      localStorage.setItem("editorFont", font.value);
                    },
                    style: { fontFamily: font.family },
                    children: font.label
                  },
                  font.value
                )) })
              ] }, category))
            ] })
          ] }) }),
          showContextMenu && /* @__PURE__ */ jsxRuntime.jsxs(
            "div",
            {
              ref: contextMenuRef,
              className: styles$1.contextMenu,
              style: {
                position: "fixed",
                left: `${contextMenuPosition.x}px`,
                top: `${contextMenuPosition.y}px`,
                zIndex: 1001
              },
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("h3", { className: styles$1.contextMenuTitle, children: "Insert Markdown" }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.contextMenuItems, children: [
                  markdownTemplates.slice(0, 8).map((item, index) => /* @__PURE__ */ jsxRuntime.jsx(
                    "button",
                    {
                      className: styles$1.contextMenuItem,
                      onClick: () => {
                        insertTemplate(item.template, item.cursor);
                        setShowContextMenu(false);
                      },
                      children: item.label
                    },
                    index
                  )),
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.contextMenuDivider }),
                  /* @__PURE__ */ jsxRuntime.jsx(
                    "button",
                    {
                      className: styles$1.contextMenuItem,
                      onClick: () => {
                        setShowContextMenu(false);
                        setShowInsertMenu(true);
                      },
                      children: "More options..."
                    }
                  )
                ] })
              ]
            }
          ),
          showInsertMenu && /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: styles$1.insertPopoverContainer,
              style: insertMenuPosition.x > 0 ? {
                position: "fixed",
                left: `${insertMenuPosition.x}px`,
                top: `${insertMenuPosition.y}px`,
                transform: "none"
              } : void 0,
              children: /* @__PURE__ */ jsxRuntime.jsxs("div", { ref: insertRef, className: styles$1.insertPopover, children: [
                /* @__PURE__ */ jsxRuntime.jsx("h3", { className: styles$1.insertPopoverTitle, children: "Insert Markdown" }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.insertGrid, children: markdownTemplates.map((item, index) => /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    className: styles$1.insertGridItem,
                    onClick: () => {
                      if (item.action) {
                        item.action();
                      } else {
                        insertTemplate(item.template, item.cursor);
                      }
                    },
                    title: item.template === "custom" ? "Insert HTML image with custom dimensions" : item.template,
                    children: item.label
                  },
                  index
                )) })
              ] })
            }
          )
        ]
      }
    ),
    showMetadata && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.metadataPanel, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.metadataContent, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "abstract", className: styles$1.label, children: "Abstract" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "textarea",
          {
            id: "abstract",
            value: abstract,
            onChange: (e) => setAbstract(e.target.value),
            placeholder: "Brief description of your paper",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.formGroup, children: [
        /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "tags", className: styles$1.label, children: "Tags (comma-separated)" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            id: "tags",
            value: tags2,
            onChange: (e) => setTags(e.target.value),
            placeholder: "tag1, tag2, tag3"
          }
        )
      ] })
    ] }) }),
    showRevisions && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionsPanel, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionsPanelHeader, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionsPanelTitle, children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", { children: "Revision History" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.createVersionButton,
              onClick: () => setShowCreateVersionModal(true),
              children: "+ Create Version"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.closePanelButton,
            onClick: () => setShowRevisions(false),
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.revisionsList, children: loadingRevisions2 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.loadingRevisions, children: "Loading revisions..." }) : revisions.length === 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.noRevisions, children: "No previous revisions" }) : revisions.map((revision) => /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionItem, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionInfo, children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.revisionTitle, children: revision.title }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionMeta, children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.revisionDate, children: formatRevisionDate(revision.createdAt) }),
            revision.author && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.revisionAuthor, children: [
              "by ",
              revision.author.email
            ] })
          ] }),
          (revision.message || revision.autoDescription) && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.revisionDescription, children: revision.message || revision.autoDescription })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionActions, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.viewButton,
              onClick: () => handleViewRevision(revision.id),
              children: "View"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.compareButton,
              onClick: () => handleCompareRevision(revision.id),
              children: "Compare"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.restoreButton,
              onClick: () => handleRestoreRevision(revision.id),
              children: "Restore"
            }
          )
        ] })
      ] }, revision.id)) })
    ] }),
    error2 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.editorError, children: error2 }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `${styles$1.editorContent} ${viewMode === "focused" ? styles$1.focusedMode : ""}`, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.editorPane, ref: editorPaneRef, children: /* @__PURE__ */ jsxRuntime.jsx(
        "textarea",
        {
          ref: textareaRef,
          className: styles$1.markdownTextarea,
          value: content,
          onChange: (e) => {
            const newContent = e.target.value;
            setContent(newContent);
            if (textareaRef.current) {
              addToHistory(newContent, textareaRef.current.selectionStart, textareaRef.current.selectionEnd);
            }
          },
          onContextMenu: handleContextMenu,
          placeholder: "Write your paper content in Markdown...",
          style: {
            fontFamily: (_a = allFonts.find((f) => f.value === selectedFont)) == null ? void 0 : _a.family,
            fontSize: `${fontSize}px`,
            lineHeight: fontSize >= 24 ? "1.8" : "1.6"
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: `${styles$1.editorPane} ${viewMode === "focused" ? styles$1.previewPane : ""}`, ref: previewPaneRef, children: /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          className: styles$1.preview,
          style: {
            fontFamily: (_b = allFonts.find((f) => f.value === selectedFont)) == null ? void 0 : _b.family,
            fontSize: `${fontSize}px`,
            lineHeight: fontSize >= 24 ? "1.8" : "1.6"
          },
          children: /* @__PURE__ */ jsxRuntime.jsx(MarkdownRenderer, { content, font: selectedFont })
        }
      ) })
    ] }),
    previewRevision && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.revisionPreviewOverlay, onClick: () => setPreviewRevision(null), children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionPreviewModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionPreviewHeader, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx("h2", { children: previewRevision.title }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionPreviewDate, children: [
            "Version from ",
            formatRevisionDate(previewRevision.createdAt)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.closePreviewButton,
            onClick: () => setPreviewRevision(null),
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionPreviewContent, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionPreviewMetadata, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionPreviewSection, children: [
            /* @__PURE__ */ jsxRuntime.jsx("h4", { children: "Abstract" }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { children: previewRevision.abstract })
          ] }),
          previewRevision.tags.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.revisionPreviewSection, children: [
            /* @__PURE__ */ jsxRuntime.jsx("h4", { children: "Tags" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.revisionPreviewTags, children: previewRevision.tags.map((tag2, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.revisionPreviewTag, children: tag2 }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.revisionPreviewDivider }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.revisionPreviewMarkdown, children: /* @__PURE__ */ jsxRuntime.jsx(MarkdownRenderer, { content: previewRevision.content || "" }) })
      ] })
    ] }) }),
    showDiffView && compareRevision && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.diffViewOverlay, onClick: () => {
      setShowDiffView(false);
      setCompareRevision(null);
    }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffViewModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.diffViewHeader, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "Compare Versions" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.closeDiffButton,
            onClick: () => {
              setShowDiffView(false);
              setCompareRevision(null);
            },
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.diffViewContent, children: /* @__PURE__ */ jsxRuntime.jsx(
        DiffViewer,
        {
          oldContent: compareRevision.content || "",
          newContent: content,
          oldTitle: `Version from ${formatRevisionDate(compareRevision.createdAt)}`,
          newTitle: "Current Version",
          viewMode: "unified"
        }
      ) })
    ] }) }),
    showCreateVersionModal && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.createVersionOverlay, onClick: () => setShowCreateVersionModal(false), children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.createVersionModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.createVersionHeader, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "Create Version" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.closeCreateVersionButton,
            onClick: () => {
              setShowCreateVersionModal(false);
              setVersionMessage("");
            },
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.createVersionContent, children: [
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: styles$1.createVersionDescription, children: "Create a manual checkpoint of your current work with a description." }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "textarea",
          {
            className: styles$1.versionMessageInput,
            placeholder: "Describe the changes in this version...",
            value: versionMessage2,
            onChange: (e) => setVersionMessage(e.target.value),
            rows: 4
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.createVersionActions, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.cancelButton,
              onClick: () => {
                setShowCreateVersionModal(false);
                setVersionMessage("");
              },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.confirmCreateButton,
              onClick: handleCreateVersion,
              disabled: !versionMessage2.trim(),
              children: "Create Version"
            }
          )
        ] })
      ] })
    ] }) }),
    showPaperSelection && /* @__PURE__ */ jsxRuntime.jsx(
      PaperSelectionModal,
      {
        papers: availablePapers,
        onSelect: handleSelectPaperForMerge,
        onCancel: () => setShowPaperSelection(false)
      }
    ),
    showMergeModal && mergeSourcePaper && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.mergeModalOverlay, onClick: () => {
      setShowMergeModal(false);
      setMergeSourcePaper(null);
    }, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.mergeModalContent, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntime.jsx(
      MergeView,
      {
        baseContent: content,
        incomingContent: mergeSourcePaper.content || "",
        baseTitle: title,
        incomingTitle: mergeSourcePaper.title,
        onApply: handleApplyMerge,
        onCancel: () => {
          setShowMergeModal(false);
          setMergeSourcePaper(null);
        }
      }
    ) }) }),
    showPublishModal && paper && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.publishModalOverlay, onClick: () => setShowPublishModal(false), children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.publishModal, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.publishModalHeader, children: [
        /* @__PURE__ */ jsxRuntime.jsx("h2", { children: "Publish Version" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            className: styles$1.closePublishButton,
            onClick: () => {
              setShowPublishModal(false);
              setSelectedVersionId(null);
              setSelectedVersionDetails(null);
            },
            children: "✕"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.publishModalContent, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.publishModalInfo, children: [
          /* @__PURE__ */ jsxRuntime.jsx("p", { children: "Select a version to publish. Publishing will replace any previous published version of this paper." }),
          /* @__PURE__ */ jsxRuntime.jsx("p", { className: styles$1.publishModalHint, children: "Previous versions will remain accessible via their direct URLs for historical reference." })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.publishModalBody, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.versionsList, children: [
            /* @__PURE__ */ jsxRuntime.jsxs(
              "div",
              {
                className: `${styles$1.versionItem} ${selectedVersionId === "current" ? styles$1.selected : ""}`,
                onClick: () => handleVersionSelect("current"),
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionRadio, children: /* @__PURE__ */ jsxRuntime.jsx(
                    "input",
                    {
                      type: "radio",
                      name: "version",
                      checked: selectedVersionId === "current",
                      onChange: () => {
                      }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.versionDetails, children: [
                    /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionTitle, children: "Current Version" }),
                    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.versionDate, children: [
                      "Last saved ",
                      timeSinceLastSave
                    ] }),
                    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.versionStatus, children: [
                      saveStatus2 === "saved" ? "All changes saved" : "Unsaved changes",
                      publishedVersions.some((pv) => pv.revisionId === null) && /* @__PURE__ */ jsxRuntime.jsx(
                        "span",
                        {
                          className: styles$1.publishedBadge,
                          "data-status": ((_c = publishedVersions.find((pv) => pv.revisionId === null)) == null ? void 0 : _c.replacedBy) ? "replaced" : ((_d = publishedVersions.find((pv) => pv.revisionId === null)) == null ? void 0 : _d.isCanonical) ? "current" : "published",
                          children: ((_e = publishedVersions.find((pv) => pv.revisionId === null)) == null ? void 0 : _e.replacedBy) ? "Replaced" : ((_f = publishedVersions.find((pv) => pv.revisionId === null)) == null ? void 0 : _f.isCanonical) ? "Current" : "Published"
                        }
                      )
                    ] })
                  ] })
                ]
              }
            ),
            revisions.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionDivider, children: "Previous Versions" }),
              revisions.map((revision) => {
                var _a2, _b2, _c2, _d2;
                return /* @__PURE__ */ jsxRuntime.jsxs(
                  "div",
                  {
                    className: `${styles$1.versionItem} ${selectedVersionId === revision.id ? styles$1.selected : ""}`,
                    onClick: () => handleVersionSelect(revision.id),
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionRadio, children: /* @__PURE__ */ jsxRuntime.jsx(
                        "input",
                        {
                          type: "radio",
                          name: "version",
                          checked: selectedVersionId === revision.id,
                          onChange: () => {
                          }
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.versionDetails, children: [
                        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionTitle, children: revision.title }),
                        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionDate, children: formatRevisionDate(revision.createdAt) }),
                        revision.message && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionMessage, children: revision.message }),
                        publishedVersions.some((pv) => pv.revisionId === revision.id) && /* @__PURE__ */ jsxRuntime.jsx(
                          "span",
                          {
                            className: styles$1.publishedBadge,
                            "data-status": ((_a2 = publishedVersions.find((pv) => pv.revisionId === revision.id)) == null ? void 0 : _a2.replacedBy) ? "replaced" : ((_b2 = publishedVersions.find((pv) => pv.revisionId === revision.id)) == null ? void 0 : _b2.isCanonical) ? "current" : "published",
                            children: ((_c2 = publishedVersions.find((pv) => pv.revisionId === revision.id)) == null ? void 0 : _c2.replacedBy) ? "Replaced" : ((_d2 = publishedVersions.find((pv) => pv.revisionId === revision.id)) == null ? void 0 : _d2.isCanonical) ? "Current" : "Published"
                          }
                        )
                      ] })
                    ]
                  },
                  revision.id
                );
              })
            ] })
          ] }),
          selectedVersionDetails && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionPreview, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionPreviewContent, children: loadingVersionDetails ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.loadingPreview, children: "Loading preview..." }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.versionPreviewMeta, children: [
              /* @__PURE__ */ jsxRuntime.jsx("h2", { children: selectedVersionDetails.title }),
              selectedVersionDetails.abstract && /* @__PURE__ */ jsxRuntime.jsx("p", { className: styles$1.versionPreviewAbstract, children: selectedVersionDetails.abstract }),
              selectedVersionDetails.tags.length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionPreviewTags, children: selectedVersionDetails.tags.map((tag2, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.versionPreviewTag, children: tag2 }, i)) })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.versionPreviewDivider }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: styles$1.versionPreviewMarkdown,
                style: {
                  fontFamily: (_g = allFonts.find((f) => f.value === selectedFont)) == null ? void 0 : _g.family,
                  fontSize: `${fontSize}px`,
                  lineHeight: fontSize >= 24 ? "1.8" : "1.6"
                },
                children: /* @__PURE__ */ jsxRuntime.jsx(MarkdownRenderer, { content: selectedVersionDetails.content })
              }
            )
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.publishModalActions, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.cancelPublishButton,
              onClick: () => {
                setShowPublishModal(false);
                setSelectedVersionId(null);
                setSelectedVersionDetails(null);
              },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.confirmPublishButton,
              onClick: async () => {
                if (!selectedVersionId || !paper) return;
                setPublishing(true);
                try {
                  const { publishedVersion } = await api.post(`/papers/${paper.id}/publish`, {
                    versionId: selectedVersionId
                  });
                  console.log("Published successfully:", publishedVersion);
                  setShowPublishModal(false);
                  setSelectedVersionId(null);
                  setSelectedVersionDetails(null);
                  const { publishedVersions: updated } = await api.get(`/papers/${paper.id}/published`);
                  setPublishedVersions(updated);
                  setPublishedUrl(`${window.location.origin}/p/${publishedVersion.slug}`);
                  setShowSuccessModal(true);
                } catch (err) {
                  setError(err.message || "Failed to publish version");
                } finally {
                  setPublishing(false);
                }
              },
              disabled: !selectedVersionId || publishing,
              children: publishing ? "Publishing..." : "Publish Version"
            }
          )
        ] })
      ] })
    ] }) }),
    showSuccessModal && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.successModalOverlay, children: [
      /* @__PURE__ */ jsxRuntime.jsx(Confetti, {}),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.successModal, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.successModalContent, children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.successIcon, children: "🎉" }),
        /* @__PURE__ */ jsxRuntime.jsx("h1", { className: styles$1.successTitle, children: "Congratulations!" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: styles$1.successMessage, children: "Your paper has been published successfully." }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.successUrl, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              value: publishedUrl,
              readOnly: true,
              className: styles$1.successUrlInput,
              onClick: (e) => e.target.select()
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.copyButton,
              onClick: () => {
                navigator.clipboard.writeText(publishedUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2e3);
              },
              children: copied ? "✓ Copied!" : "Copy Link"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.successActions, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.viewPublishedButton,
              onClick: () => window.open(publishedUrl, "_blank"),
              children: "View Published Version"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              className: styles$1.continueEditingButton,
              onClick: () => {
                setShowSuccessModal(false);
                setCopied(false);
              },
              children: "Continue Editing"
            }
          )
        ] })
      ] }) })
    ] }),
    showImageDialog && /* @__PURE__ */ jsxRuntime.jsx(
      ImageInsertDialog,
      {
        onInsert: handleImageInsert,
        onClose: () => setShowImageDialog(false)
      }
    ),
    showUploadModal && /* @__PURE__ */ jsxRuntime.jsx(
      FileUploadModal,
      {
        onConfirm: handleFileUpload,
        onClose: () => setShowUploadModal(false)
      }
    ),
    showAiFeedback && /* @__PURE__ */ jsxRuntime.jsx(
      AiFeedbackModal,
      {
        isOpen: showAiFeedback,
        onClose: () => setShowAiFeedback(false),
        content,
        title,
        abstract,
        paperId: id
      }
    )
  ] });
}
function DashboardPage() {
  const [papers, setPapers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedPaper, setSelectedPaper] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const navigate = reactRouterDom.useNavigate();
  const { isMobile, isOpen, toggle } = useMobileToggle();
  React.useEffect(() => {
    api.get("/papers/user/papers").then(({ papers: papers2 }) => {
      setPapers(papers2);
      if (papers2.length > 0 && !selectedPaper) {
        setSelectedPaper(papers2[0]);
      }
    }).finally(() => setLoading(false));
  }, []);
  const handleDelete = async (paperId) => {
    if (confirm("Are you sure you want to delete this paper?")) {
      await api.delete(`/papers/${paperId}`);
      setPapers(papers.filter((p) => p.id !== paperId));
      if ((selectedPaper == null ? void 0 : selectedPaper.id) === paperId) {
        setSelectedPaper(null);
      }
    }
  };
  const formatDate = (dateValue) => {
    if (!dateValue) return "Unknown date";
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "Unknown date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "Unknown date";
    }
  };
  const allTags = Array.from(new Set(papers.flatMap((p) => p.tags)));
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch = searchQuery === "" || paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) || paper.tags.some((tag2) => tag2.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = tagFilter === "" || paper.tags.includes(tagFilter);
    const matchesStatus = statusFilter === "all" || statusFilter === "published" && paper.published || statusFilter === "draft" && !paper.published;
    return matchesSearch && matchesTag && matchesStatus;
  });
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const currentIndex = filteredPapers.findIndex((p) => p.id === (selectedPaper == null ? void 0 : selectedPaper.id));
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            setSelectedPaper(filteredPapers[currentIndex - 1]);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < filteredPapers.length - 1) {
            setSelectedPaper(filteredPapers[currentIndex + 1]);
          }
          break;
        case "Enter":
          e.preventDefault();
          if (selectedPaper) {
            navigate(`/editor/${selectedPaper.id}`);
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPaper, filteredPapers, navigate]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.container, children: "Loading..." });
  }
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.dashboardContainer, children: papers.length === 0 ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.emptyState, children: [
    /* @__PURE__ */ jsxRuntime.jsx("p", { children: "You haven't created any papers yet." }),
    /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Link, { to: "/editor", className: styles$1.newPaperButtonLarge, children: "Create your first paper" })
  ] }) : isMobile ? (
    // Mobile view - Grid layout
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.dashboardContainer, children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.dashboardHeader, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.dashboardHeaderContent, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.dashboardHeaderFilters, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search papers...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: styles$1.searchInput
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "select",
          {
            value: statusFilter,
            onChange: (e) => setStatusFilter(e.target.value),
            className: styles$1.filterSelect,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "all", children: "All Papers" }),
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "published", children: "Published" }),
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "draft", children: "Drafts" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          "select",
          {
            value: tagFilter,
            onChange: (e) => setTagFilter(e.target.value),
            className: styles$1.filterSelect,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "All Tags" }),
              allTags.map((tag2) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: tag2, children: tag2 }, tag2))
            ]
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.dashboardActions, children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Link, { to: "/editor", className: styles$1.newPaperButton, children: "Create new paper" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.papersGrid, children: filteredPapers.map((paper) => /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          className: styles$1.paperGridCard,
          onClick: () => navigate(`/editor/${paper.id}`),
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("h3", { className: styles$1.paperGridTitle, children: paper.title }),
            paper.abstract && /* @__PURE__ */ jsxRuntime.jsx("p", { className: styles$1.paperGridAbstract, children: paper.abstract }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperGridMeta, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: formatDate(paper.updatedAt) }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: paper.published ? styles$1.statusPublished : styles$1.statusDraft, children: paper.published ? "Published" : "Draft" })
            ] }),
            paper.tags.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperGridTags, children: [
              paper.tags.slice(0, 3).map((tag2, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperGridTag, children: tag2 }, i)),
              paper.tags.length > 3 && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.paperGridTag, children: [
                "+",
                paper.tags.length - 3
              ] })
            ] })
          ]
        },
        paper.id
      )) })
    ] })
  ) : (
    // Desktop view - List layout
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.listViewContainer, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `${styles$1.listSidebar} ${isMobile && !isOpen ? styles$1.collapsed : ""}`, children: [
        isMobile && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `${styles$1.mobileToggle} ${isOpen ? styles$1.open : ""}`, onClick: toggle, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
            "My Papers (",
            filteredPapers.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.listFilters, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            "input",
            {
              type: "text",
              placeholder: "Search papers...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: styles$1.searchInputCompact
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "select",
            {
              value: statusFilter,
              onChange: (e) => setStatusFilter(e.target.value),
              className: styles$1.filterSelectCompact,
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("option", { value: "all", children: "All" }),
                /* @__PURE__ */ jsxRuntime.jsx("option", { value: "published", children: "Published" }),
                /* @__PURE__ */ jsxRuntime.jsx("option", { value: "draft", children: "Drafts" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs(
            "select",
            {
              value: tagFilter,
              onChange: (e) => setTagFilter(e.target.value),
              className: styles$1.filterSelectCompact,
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("option", { value: "", children: "All Tags" }),
                allTags.map((tag2) => /* @__PURE__ */ jsxRuntime.jsx("option", { value: tag2, children: tag2 }, tag2))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.papersList, children: filteredPapers.map((paper) => /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: `${styles$1.paperListItem} ${(selectedPaper == null ? void 0 : selectedPaper.id) === paper.id ? styles$1.selected : ""}`,
            onClick: () => setSelectedPaper(paper),
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperListItemHeader, children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperListItemTitle, children: paper.title }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${styles$1.statusDot} ${paper.published ? styles$1.published : styles$1.draft}` })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperListItemMeta, children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperListItemDate, children: formatDate(paper.updatedAt) }),
                paper.tags.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.paperListItemTags, children: [
                  paper.tags.length,
                  " tags"
                ] })
              ] })
            ]
          },
          paper.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.listDetail, children: selectedPaper ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetail, children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetailHeader, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("h2", { className: styles$1.paperDetailTitle, children: selectedPaper.title }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetailMeta, children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: `${styles$1.statusBadge} ${selectedPaper.published ? styles$1.published : styles$1.draft}`, children: selectedPaper.published ? "Published" : "Draft" }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { className: styles$1.paperDetailDate, children: [
                "Last updated ",
                formatDate(selectedPaper.updatedAt)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetailActions, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => navigate(`/editor/${selectedPaper.id}`),
                className: styles$1.editButton,
                children: "Edit"
              }
            ),
            selectedPaper.published && /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => navigate(`/paper/${selectedPaper.slug}`),
                className: styles$1.viewButton,
                children: "View"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => handleDelete(selectedPaper.id),
                className: styles$1.deleteButton,
                children: "Delete"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: styles$1.paperDetailContent, children: [
          selectedPaper.abstract && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperDetailSection, children: /* @__PURE__ */ jsxRuntime.jsx("p", { children: selectedPaper.abstract }) }),
          selectedPaper.tags.length > 0 && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperDetailSection, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperDetailTags, children: selectedPaper.tags.map((tag2, i) => /* @__PURE__ */ jsxRuntime.jsx("span", { className: styles$1.paperDetailTag, children: tag2 }, i)) }) }),
          selectedPaper.content && /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperDetailSection, children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.paperDetailMarkdownPreview, children: /* @__PURE__ */ jsxRuntime.jsx(
            MarkdownRenderer,
            {
              content: selectedPaper.content.length > 1e3 ? selectedPaper.content.substring(0, 1e3) + "..." : selectedPaper.content
            }
          ) }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntime.jsx("div", { className: styles$1.noSelection, children: /* @__PURE__ */ jsxRuntime.jsx("p", { children: "Select a paper from the list to view details" }) }) })
    ] })
  ) });
}
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { children: "Loading..." });
  }
  if (!user) {
    return /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Navigate, { to: "/login", replace: true });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children });
}
function render({ path, paperData }) {
  const html = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsxRuntime.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntime.jsx(server_mjs.StaticRouter, { location: path, children: /* @__PURE__ */ jsxRuntime.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Routes, { children: /* @__PURE__ */ jsxRuntime.jsxs(reactRouterDom.Route, { path: "/", element: /* @__PURE__ */ jsxRuntime.jsx(Layout, {}), children: [
      /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { index: true, element: /* @__PURE__ */ jsxRuntime.jsx(HomePage, {}) }),
      /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "login", element: /* @__PURE__ */ jsxRuntime.jsx(LoginPage, {}) }),
      /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "paper/:slug", element: /* @__PURE__ */ jsxRuntime.jsx(PaperPage, {}) }),
      /* @__PURE__ */ jsxRuntime.jsx(reactRouterDom.Route, { path: "p/:slug", element: /* @__PURE__ */ jsxRuntime.jsx(PaperPage, {}) }),
      /* @__PURE__ */ jsxRuntime.jsx(
        reactRouterDom.Route,
        {
          path: "dashboard",
          element: /* @__PURE__ */ jsxRuntime.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntime.jsx(DashboardPage, {}) })
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        reactRouterDom.Route,
        {
          path: "editor/:id?",
          element: /* @__PURE__ */ jsxRuntime.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntime.jsx(EditorPage, {}) })
        }
      )
    ] }) }) }) }) })
  );
  return { html, paperData };
}
exports.render = render;
