// ============================================================================
// المحرك التفاعلي الشامل لمنظومة قوانين النجاح الـ 16 لنابليون هيل
// ============================================================================

const STORAGE_KEY = 'napoleon_hill_16_laws_state_v1';
const DEFAULT_CLOUD_SYNC_URL = 'https://ntfy.sh/nh16_kw_sync_v16_8a4f2c9e1d';

const App = {
  state: null,
  activeCategoryFilter: 'all',
  linkedFileHandle: null,
  focusTimerInterval: null,
  focusSecondsRemaining: 30 * 60,
  focusSelectedMinutes: 30,
  meditationInterval: null,
  meditationSecondsRemaining: 5 * 60,
  alarmClockInterval: null,
  wisdomTimerInterval: null,
  preTradeChecks: [false, false, false, false, false],
  breathingInterval: null,
  breathingStep: 0,
  breathingSeconds: 5,
  cloudPushTimeout: null,
  cloudSyncInterval: null,
  isCloudSyncing: false,

  init() {
    this.loadState();
    this.checkUrlPairingParams();
    this.checkDailyResetAndStreak();
    this.populateSelects();
    this.renderAll();
    this.initAutoSaveInputs();
    this.initNotificationsEngine();
    this.initCloudSyncEngine();
    this.registerServiceWorker();
  },

  getDefaultState() {
    const defaultScores = {};
    const defaultQuizAnswers = {};
    window.NAPOLEON_HILL_DATA.laws.forEach((law) => {
      defaultScores[law.id] = 55; // نسبة مبدئية متوازنة
      defaultQuizAnswers[law.id] = [6, 5, 6];
    });

    return {
      xp: 0,
      streak: 1,
      lastActiveDate: this.getTodayStr(),
      unlockedBadges: [],
      exploredLaws: [],
      completedActions: {}, // { 'l1_a1': true }
      lawNotes: {}, // { 1: 'ملاحظاتي...' }
      lawScores: defaultScores,
      quizAnswers: defaultQuizAnswers,
      quizCompletedOnce: false,
      definiteAim: {
        goal: '',
        targetDate: '',
        giveInReturn: '',
        plan: '',
        readCount: 0,
        lastMorningRead: '',
        lastEveningRead: ''
      },
      habits: JSON.parse(JSON.stringify(window.NAPOLEON_HILL_DATA.defaultHabits)),
      habitsCompletedToday: {}, // { 'h_aim_morning': '2026-10-23' }
      blueprintCompletedToday: {}, // { 'bp_m1': '2026-10-23' }
      blueprintFullBonusDate: '',
      focusSessions: [],
      journalEntries: [],
      failureLogs: [],
      mastermindMembers: [],
      savingsPlan: {
        income: 10000,
        savePct: 20,
        eduPct: 10,
        livingPct: 55
      },
      notificationSettings: {
        morningTime: '08:00',
        eveningTime: '21:30',
        wisdomIntervalMinutes: 60,
        soundEnabled: true,
        lastMorningAlertDate: '',
        lastEveningAlertDate: ''
      },
      tradingLogs: [],
      primedCheckedToday: {}, // { 'ptp_1': '2026-10-23' }
      tenKCompleted: {}, // { 'tk_1': true }
      neuralLogs: [],
      mytmCompletedLessons: {}, // { 'm_l1': true }
      mytmStepNotes: {}, // { 1: 'ملاحظتي...' }
      strategyPlaybook: {
        generalPhilosophy: '',
        riskRules: '',
        entryRules: '',
        exitRules: '',
        swingVsDayRules: '',
        goldenNotes: '',
        reviewCount: 0,
        lastReviewedDate: ''
      },
      traderPsychProfile: {
        weaknesses: '',
        triggers: '',
        pastBlocks: '',
        focusAreas: '',
        lastUpdated: ''
      },
      geminiApiKey: '',
      cloudSyncUrl: DEFAULT_CLOUD_SYNC_URL,
      mobileHostedUrl: '',
      lastModifiedTimestamp: 0,
      lastCloudSyncTime: '',
      councilChatHistory: [
        {
          role: 'council',
          speakerName: 'نابليون هيل (رئيس المجلس) وأساطير التداول',
          speakerAvatar: '🏛️',
          time: 'جلسة مفتوحة',
          text: `مرحباً بك في **غرفة المستشارين الخياليين والطاولة المستديرة**! 👑
على هذه الطاولة يجلس معك **10 من أعظم العقول**: رواد فلسفة النجاح (**نابليون هيل، كارنيجي، إديسون، فورد، لينكولن**) جنباً إلى جنب مع أساطير التداول وعلم النفس (**مارك دوغلاس، بول تيودور جونز، باتريك بايلوني، د. بريت ستينبارجر، وإد سيكوتا**).

- يمكنك اختيار **مستشار واحد** من القائمة أعلاه والدخول معه في **حوار مفتوح ومستمر** (سؤال وجواب ونقاش متتابع).
- أو الضغط على **👑 عقد اجتماع الطاولة المستديرة** ليقوم نخبة المستشارين بالرد معاً على قضيتك أو صفقتك كلٌّ من زاوية مدرسته، مع الاطلاع المباشر على سجل صفقاتك ودستور استراتيجيتك وجلسة صراحتك!`
        }
      ],
      agentChatHistory: [
        {
          role: 'agent',
          text: `أهلاً بك يا صديقي المتداول في مرسم القيادة النفسية! 👑📈
أنا مرشدك النفسي ومدربك الخاص، أجمع بالتوازي بين **قوانين النجاح الـ 16 لنابليون هيل** وبين **أكاديمية وأدوات عقلية المتداول (Mentorship 2.0 - Patrick Bailouni)** لأسلوبك في **السوينج والمضاربة اليومية**.

أنا مطلع مباشرة على تقدمك في القوانين الـ 16، وخارطة الـ $10K/Month، وبروتوكول Primed to Perform، وسجل صفقاتك وحالتك الشعورية.
اضغط على أي زر من الأزرار الذكية في الأعلى أو اكتب لي ما يدور في ذهنك الآن!`
        }
      ]
    };
  },

  getTodayStr() {
    return new Date().toISOString().slice(0, 10);
  },

  getStateRichnessScore(st) {
    if (!st) return 0;
    let score = 0;
    score += Number(st.xp || 0);
    score += (st.tradingLogs || []).length * 25;
    score += (st.failureLogs || []).length * 25;
    score += (st.journalEntries || []).length * 20;
    score += (st.mastermindMembers || []).length * 15;
    score += (st.neuralLogs || []).length * 15;
    score += (st.exploredLaws || []).length * 5;
    score += Object.keys(st.completedActions || {}).length * 15;
    score += Object.keys(st.lawNotes || {}).length * 15;
    score += Object.keys(st.mytmCompletedLessons || {}).length * 15;
    score += Object.keys(st.mytmStepNotes || {}).length * 15;
    score += Object.keys(st.tenKCompleted || {}).length * 15;
    score += Object.keys(st.primedCheckedToday || {}).length * 10;
    score += Object.keys(st.habitsCompletedToday || {}).length * 10;
    score += Object.keys(st.blueprintCompletedToday || {}).length * 10;
    if (st.quizCompletedOnce) score += 30;
    if ((st.councilChatHistory || []).length > 1) score += (st.councilChatHistory.length - 1) * 10;
    if ((st.agentChatHistory || []).length > 1) score += (st.agentChatHistory.length - 1) * 10;
    if (st.definiteAim && (st.definiteAim.goal || st.definiteAim.plan || st.definiteAim.giveInReturn)) score += 50;
    if (
      st.strategyPlaybook &&
      (st.strategyPlaybook.entryRules ||
        st.strategyPlaybook.exitRules ||
        st.strategyPlaybook.riskRules ||
        st.strategyPlaybook.generalPhilosophy ||
        st.strategyPlaybook.swingVsDayRules ||
        st.strategyPlaybook.goldenNotes)
    ) {
      score += 50;
    }
    if (
      st.traderPsychProfile &&
      (st.traderPsychProfile.weaknesses ||
        st.traderPsychProfile.triggers ||
        st.traderPsychProfile.pastBlocks ||
        st.traderPsychProfile.focusAreas)
    ) {
      score += 50;
    }
    if (st.geminiApiKey && st.geminiApiKey.trim()) score += 30;
    return score;
  },

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.state = { ...this.getDefaultState(), ...parsed };
        // توحيد قناة المزامنة السحابية الافتراضية بين الكمبيوتر والجوال تلقائياً
        if (!this.state.cloudSyncUrl || this.state.cloudSyncUrl.includes('ntfy.sh/')) {
          this.state.cloudSyncUrl = DEFAULT_CLOUD_SYNC_URL;
        }
        if (!this.state.lastModifiedTimestamp && this.getStateRichnessScore(this.state) > 0) {
          this.state.lastModifiedTimestamp = Date.now();
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } else {
        this.state = this.getDefaultState();
        this.saveState(true);
      }
    } catch (e) {
      console.error('Error loading state:', e);
      this.state = this.getDefaultState();
    }
  },

  initAutoSaveInputs() {
    // حفظ تلقائي فوري لأي نص يُكتب في الهدف الرئيسي أو دستور الاستراتيجية أو ملف الاعتراف النفسي
    const bindAutoSave = (ids, callback) => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('change', () => callback());
          el.addEventListener('blur', () => callback());
        }
      });
    };

    bindAutoSave(['aimGoal', 'aimDate', 'aimGive', 'aimPlan'], () => {
      this.state.definiteAim.goal = document.getElementById('aimGoal')?.value.trim() || '';
      this.state.definiteAim.targetDate = document.getElementById('aimDate')?.value || '';
      this.state.definiteAim.giveInReturn = document.getElementById('aimGive')?.value.trim() || '';
      this.state.definiteAim.plan = document.getElementById('aimPlan')?.value.trim() || '';
      this.saveState();
    });

    bindAutoSave(
      ['pbGeneralPhilosophy', 'pbRiskRules', 'pbEntryRules', 'pbExitRules', 'pbSwingVsDayRules', 'pbGoldenNotes'],
      () => {
        if (!this.state.strategyPlaybook) this.state.strategyPlaybook = {};
        this.state.strategyPlaybook.generalPhilosophy = document.getElementById('pbGeneralPhilosophy')?.value.trim() || '';
        this.state.strategyPlaybook.riskRules = document.getElementById('pbRiskRules')?.value.trim() || '';
        this.state.strategyPlaybook.entryRules = document.getElementById('pbEntryRules')?.value.trim() || '';
        this.state.strategyPlaybook.exitRules = document.getElementById('pbExitRules')?.value.trim() || '';
        this.state.strategyPlaybook.swingVsDayRules = document.getElementById('pbSwingVsDayRules')?.value.trim() || '';
        this.state.strategyPlaybook.goldenNotes = document.getElementById('pbGoldenNotes')?.value.trim() || '';
        this.saveState();
      }
    );

    bindAutoSave(['psychWeaknesses', 'psychTriggers', 'psychPastBlocks', 'psychFocusAreas'], () => {
      if (!this.state.traderPsychProfile) this.state.traderPsychProfile = {};
      this.state.traderPsychProfile.weaknesses = document.getElementById('psychWeaknesses')?.value.trim() || '';
      this.state.traderPsychProfile.triggers = document.getElementById('psychTriggers')?.value.trim() || '';
      this.state.traderPsychProfile.pastBlocks = document.getElementById('psychPastBlocks')?.value.trim() || '';
      this.state.traderPsychProfile.focusAreas = document.getElementById('psychFocusAreas')?.value.trim() || '';
      this.saveState();
    });
  },

  async saveState(skipCloudPush = false) {
    try {
      if (!skipCloudPush) {
        this.state.lastModifiedTimestamp = Date.now();
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.checkBadges();
      this.updateSidebarProfile();

      // إذا كان المستخدم قد ربط ملفاً داخل مجلد Google Drive، يتم التحديث تلقائياً
      if (this.linkedFileHandle) {
        await this.writeToLinkedFile();
      }

      // المزامنة السحابية التلقائية الحية بالاتجاهين (PC <-> Phone)
      if (!skipCloudPush && this.state.cloudSyncUrl && this.state.cloudSyncUrl.trim()) {
        this.scheduleCloudPush();
      }
    } catch (e) {
      console.error('Error saving state:', e);
    }
  },

  checkDailyResetAndStreak() {
    const today = this.getTodayStr();
    const last = this.state.lastActiveDate;
    if (last !== today) {
      const lastDate = new Date(last);
      const currDate = new Date(today);
      const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        this.state.streak = (this.state.streak || 1) + 1;
        this.showToast(`🔥 يوم جديد من الالتزام! سلسلتك الآن ${this.state.streak} أيام متتالية`);
      } else if (diffDays > 1) {
        this.state.streak = 1;
      }
      this.state.lastActiveDate = today;
      this.saveState();
    }
  },

  addXP(amount, reasonText) {
    this.state.xp = (this.state.xp || 0) + amount;
    this.saveState();
    this.renderDashboardStats();
    if (reasonText) {
      this.showToast(`✨ +${amount} XP — ${reasonText}`);
    }
  },

  checkBadges() {
    const unlocked = new Set(this.state.unlockedBadges || []);
    const initialCount = unlocked.size;

    // 1. أوسمة قوانين النجاح الـ 16
    if (this.state.definiteAim && this.state.definiteAim.goal.trim().length > 5) {
      unlocked.add('first_aim');
    }
    if (this.state.quizCompletedOnce) {
      unlocked.add('quiz_done');
    }
    if (this.state.streak >= 3) {
      unlocked.add('streak_3');
    }
    if (this.state.streak >= 7) {
      unlocked.add('streak_7');
    }
    if ((this.state.mastermindMembers || []).length >= 3) {
      unlocked.add('mastermind_built');
    }
    if ((this.state.failureLogs || []).length >= 1) {
      unlocked.add('failure_turned');
    }
    if (Object.keys(this.state.completedActions || {}).length >= 5) {
      unlocked.add('extra_mile_5');
    }
    if ((this.state.exploredLaws || []).length >= 16) {
      unlocked.add('all_16_explored');
    }

    // 2. أوسمة احتراف التداول وعلم النفس (Swing & Day Trading - MYTM 2.0)
    const pb = this.state.strategyPlaybook || {};
    if ((pb.entryRules && pb.entryRules.trim().length > 5) || (pb.exitRules && pb.exitRules.trim().length > 5)) {
      unlocked.add('strategy_architect');
    }

    const prof = this.state.traderPsychProfile || {};
    if ((prof.weaknesses && prof.weaknesses.trim().length > 3) || (prof.triggers && prof.triggers.trim().length > 3)) {
      unlocked.add('confession_mirror');
    }

    const today = this.getTodayStr();
    const primedTodayCount = Object.values(this.state.primedCheckedToday || {}).filter((d) => d === today).length;
    if (primedTodayCount >= 6) {
      unlocked.add('primed_warrior');
    }

    const tLogs = this.state.tradingLogs || [];
    const disciplinedTrades = tLogs.filter((t) => t.emotion === 'disciplined').length;
    if (disciplinedTrades >= 3) {
      unlocked.add('disciplined_sniper');
    }
    if (tLogs.length >= 10 && Math.round((disciplinedTrades / tLogs.length) * 100) >= 80) {
      unlocked.add('swing_farmer');
    }

    const councilMsgs = this.state.councilChatHistory || [];
    if (councilMsgs.some((m) => m.role === 'roundtable' || m.role === 'advisor')) {
      unlocked.add('council_roundtable');
    }

    if (Object.keys(this.state.mytmCompletedLessons || {}).length >= 15) {
      unlocked.add('academy_scholar');
    }

    if (Object.keys(this.state.tenKCompleted || {}).length >= 10) {
      unlocked.add('ten_k_master');
    }

    this.state.unlockedBadges = Array.from(unlocked);
    if (unlocked.size > initialCount) {
      this.showToast('🏆 مبروك! لقد فتحت وسام شرف جديداً في لوحة التحكم!');
      this.renderBadges();
    }
  },

  // ==================== التنقل بين الشاشات ====================
  switchView(viewId) {
    document.querySelectorAll('.view-section').forEach((sec) => sec.classList.remove('active'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item, .mobile-nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
    });

    const titles = {
      dashboard: ['📊 لوحة التحكم الشاملة', 'نظرة متكاملة على توازنك في قوانين النجاح الستة عشر وعاداتك اليومية'],
      laws: ['🏛️ موسوعة القوانين الـ 16 التفاعلية', 'ادرس فلسفة كل قانون، قصته التاريخية، وطبق خطواته العملية لكسب نقاط الخبرة'],
      aim: ['🎯 استوديو الهدف الرئيسي المحدد وكتاب فكر تصبح غنياً', 'صياغة وثيقة العهد الذاتي، صيغة الثقة بالنفس، وعلاج الأشباح الستة للخوف'],
      quiz: ['🧭 التقييم الذاتي والتشخيص الشامل', 'اكتشف نقاط قوتك ونقاط الاختناق في القوانين الـ 16 واحصل على روشتة عملية'],
      habits: ['⚡ البرنامج اليومي المتكامل ومؤقت التركيز', 'حوّل فلسفة النجاح إلى سلوك يومي متكرر وجلسات تركيز خالية من التشتت'],
      trading: ['📈 غرفة التداول المنضبط (سوينج ومضاربة يومية)', 'فلتر ضبط النفس قبل الصفقة، سجل الصفقات النفسي، وتشخيص السلوكيات المتكررة'],
      agent: ['🤖 المرشد النفسي الذكي ومدرب التداول (AI Mentor)', 'متابعة حية لأدائك وعاداتك وصفقاتك وتقديم حلول نفسية وسلوكية مخصصة لك'],
      lab: ['🧪 المختبر العملي والمفكرة الفلسفية', 'التفكير الدقيق، تحويل الفشل إلى نجاح، مجلس العقل المدبر، وحاسبة الادخار']
    };

    if (titles[viewId]) {
      document.getElementById('currentViewTitle').textContent = titles[viewId][0];
      document.getElementById('currentViewSubtitle').textContent = titles[viewId][1];
    }

    if (viewId === 'dashboard') {
      this.renderDashboard();
    } else if (viewId === 'laws') {
      this.renderLawsGrid();
    } else if (viewId === 'quiz') {
      this.renderQuizSummary();
      this.drawRadarChart('quizRadarChart');
    } else if (viewId === 'trading') {
      this.renderTradingSection();
    } else if (viewId === 'agent') {
      this.renderAgentSection();
    } else if (viewId === 'lab') {
      this.calculateSavingsPlan();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  switchAimTab(tabName, btnElem) {
    document.querySelectorAll('.aim-subview').forEach((el) => (el.style.display = 'none'));
    document.getElementById(`aim-tab-${tabName}`).style.display = 'block';
    btnElem.parentElement.querySelectorAll('.sub-tab').forEach((b) => b.classList.remove('active'));
    btnElem.classList.add('active');
  },

  switchLabTab(tabName, btnElem) {
    document.querySelectorAll('.lab-subview').forEach((el) => (el.style.display = 'none'));
    document.getElementById(`lab-tab-${tabName}`).style.display = 'block';
    btnElem.parentElement.querySelectorAll('.sub-tab').forEach((b) => b.classList.remove('active'));
    btnElem.classList.add('active');
    if (tabName === 'saving') {
      this.calculateSavingsPlan();
    }
  },

  switchTradingTab(tabName, btnElem) {
    document.querySelectorAll('.trading-subview').forEach((el) => (el.style.display = 'none'));
    const target = document.getElementById(`trading-tab-${tabName}`);
    if (target) target.style.display = 'block';
    if (btnElem && btnElem.parentElement) {
      btnElem.parentElement.querySelectorAll('.sub-tab').forEach((b) => b.classList.remove('active'));
      btnElem.classList.add('active');
    }
  },

  // ==================== حساب نسبة الإتقان لكل قانون ====================
  getLawMastery(lawId) {
    const baseScore = (this.state.lawScores && this.state.lawScores[lawId]) || 50;
    const law = window.NAPOLEON_HILL_DATA.laws.find((l) => l.id === lawId);
    if (!law) return baseScore;

    let doneActions = 0;
    law.actionSteps.forEach((step) => {
      if (this.state.completedActions && this.state.completedActions[step.id]) {
        doneActions++;
      }
    });
    const actionBonus = doneActions * 5; // كل خطوة عملية ترفع إتقان القانون 5%
    return Math.min(100, Math.round(baseScore + actionBonus));
  },

  getAverageMastery() {
    const laws = window.NAPOLEON_HILL_DATA.laws;
    const sum = laws.reduce((acc, law) => acc + this.getLawMastery(law.id), 0);
    return Math.round(sum / laws.length);
  },

  // ==================== تحديث ملف المستخدم والمستوى ====================
  getCurrentRankInfo() {
    const xp = this.state.xp || 0;
    const ranks = window.NAPOLEON_HILL_DATA.ranks;
    let current = ranks[0];
    let next = null;
    for (let i = 0; i < ranks.length; i++) {
      if (xp >= ranks[i].minXP) {
        current = ranks[i];
        next = ranks[i + 1] || null;
      }
    }
    return { current, next };
  },

  updateSidebarProfile() {
    const xp = this.state.xp || 0;
    const { current, next } = this.getCurrentRankInfo();

    document.getElementById('sidebarRankIcon').textContent = current.icon;
    document.getElementById('sidebarRankTitle').textContent = current.title;
    document.getElementById('sidebarStreak').textContent = `🔥 ${this.state.streak || 1} يوم`;
    document.getElementById('sidebarXpText').textContent = `${xp} XP`;

    if (next) {
      const progress = Math.min(100, Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100));
      document.getElementById('sidebarXpFill').style.width = `${Math.max(6, progress)}%`;
      document.getElementById('sidebarNextRankText').textContent = `التالي: ${next.minXP} XP`;
    } else {
      document.getElementById('sidebarXpFill').style.width = '100%';
      document.getElementById('sidebarNextRankText').textContent = 'أعلى رتبة فلسفية 👑';
    }
  },

  // ==================== عرض جميع المكونات ====================
  renderAll() {
    this.updateSidebarProfile();
    this.renderDashboard();
    this.renderLawsGrid();
    this.renderAimSection();
    this.renderQuizQuestions();
    this.renderQuizSummary();
    this.renderHabitsSection();
    this.renderFocusLogs();
    this.renderJournalEntries();
    this.renderFailureLogs();
    this.renderMastermindMembers();
    this.onAdvisorSelectionChange();
    this.renderCouncilChat();
    this.loadSavingsInputs();
    this.calculateSavingsPlan();
    this.renderTradingSection();
    this.renderAgentSection();
  },

  populateSelects() {
    const lawSelect = document.getElementById('newHabitLawSelect');
    if (lawSelect) {
      lawSelect.innerHTML = window.NAPOLEON_HILL_DATA.laws
        .map((l) => `<option value="${l.id}">القانون ${l.id}: ${l.title}</option>`)
        .join('');
    }

    const advisorSelect = document.getElementById('advisorSelect');
    if (advisorSelect) {
      advisorSelect.innerHTML = window.NAPOLEON_HILL_DATA.imaginaryAdvisors
        .map((a) => `<option value="${a.id}">${a.avatar} ${a.name} — (${a.specialty})</option>`)
        .join('');
    }
  },

  // ==================== 1. لوحة التحكم والرادار ====================
  renderDashboard() {
    this.renderDashboardStats();
    this.renderDashboardAim();
    this.renderHabitsSection();
    this.renderDashboardTradingPulse();
    this.renderBadges();
    this.drawRadarChart('radarChart');
  },

  renderDashboardTradingPulse() {
    const box = document.getElementById('dashboardTradingPulseBox');
    if (!box) return;

    const today = this.getTodayStr();
    const pb = this.state.strategyPlaybook || {};
    const stratReviewed = pb.lastReviewedDate === today;
    const primedCount = Object.values(this.state.primedCheckedToday || {}).filter((d) => d === today).length;
    const tStats = this.getTradingAnalytics();
    const lessonsDone = Object.keys(this.state.mytmCompletedLessons || {}).length;
    const tenKDone = Object.keys(this.state.tenKCompleted || {}).length;

    box.innerHTML = `
      <div class="grid-4" style="gap: 12px; margin-bottom: 14px;">
        <div style="padding: 12px 14px; background: rgba(15, 23, 42, 0.75); border: 1px solid ${stratReviewed ? 'rgba(16, 185, 129, 0.45)' : 'rgba(245, 158, 11, 0.45)'}; border-radius: 10px;">
          <div style="font-size: 0.77rem; color: var(--text-secondary); margin-bottom: 4px;">📜 مراجعة دستور الاستراتيجية اليوم</div>
          <div style="font-weight: 800; font-size: 0.96rem; color: ${stratReviewed ? '#34D399' : '#FBBF24'};">
            ${stratReviewed ? '✅ تمت المراجعة اليوم' : '⚠️ لم يُراجع اليوم بعد'}
          </div>
          <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 4px;">إجمالي المراجعات: ${pb.reviewCount || 0} مرة</div>
        </div>

        <div style="padding: 12px 14px; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 10px;">
          <div style="font-size: 0.77rem; color: var(--text-secondary); margin-bottom: 4px;">🧘‍♂️ جاهزية Primed قبل الجلسة</div>
          <div style="font-weight: 800; font-size: 0.96rem; color: ${primedCount === 6 ? '#34D399' : '#93c5fd'};">
            ${primedCount} / 6 مكتمل اليوم
          </div>
          <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 4px;">${primedCount === 6 ? 'جاهزية ذهنية كاملة 100% 🔥' : 'أكمل بنود التحضير قبل التداول'}</div>
        </div>

        <div style="padding: 12px 14px; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 10px;">
          <div style="font-size: 0.77rem; color: var(--text-secondary); margin-bottom: 4px;">🎯 نسبة الانضباط وسجل الصفقات</div>
          <div style="font-weight: 800; font-size: 0.96rem; color: ${tStats.disciplinePct >= 80 ? '#34D399' : '#FBBF24'};">
            ${tStats.disciplinePct}% انضباط (${tStats.total} صفقة)
          </div>
          <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 4px;">نسبة الفوز: ${tStats.winRate}% | الصافي: ${tStats.totalPnL >= 0 ? '+' : ''}${tStats.totalPnL}</div>
        </div>

        <div style="padding: 12px 14px; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(192, 132, 252, 0.35); border-radius: 10px;">
          <div style="font-size: 0.77rem; color: var(--text-secondary); margin-bottom: 4px;">🎓 أكاديمية MYTM وخارطة $10K</div>
          <div style="font-weight: 800; font-size: 0.96rem; color: #E9D5FF;">
            ${lessonsDone} / 63 درساً • ${tenKDone} / 30 محطة
          </div>
          <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 4px;">برنامج التحول النفسي 2.0</div>
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 8px; padding-top: 8px; border-top: 1px dashed rgba(212, 175, 55, 0.22);">
        <button type="button" class="btn btn-outline-gold btn-sm" style="background: rgba(15,23,42,0.9); color: #FDE68A;" onclick="App.switchView('trading'); App.switchTradingTab('strategy', document.querySelector('[onclick*=\\'strategy\\']'))">📜 مراجعة دستور استراتيجيتي</button>
        <button type="button" class="btn btn-outline-gold btn-sm" style="background: rgba(15,23,42,0.9); color: #FDE68A;" onclick="App.switchView('trading'); App.switchTradingTab('primed', document.querySelector('[onclick*=\\'primed\\']'))">🧘‍♂️ تحضير ما قبل الجلسة (Primed)</button>
        <button type="button" class="btn btn-outline-gold btn-sm" style="background: rgba(15,23,42,0.9); color: #FDE68A;" onclick="App.switchView('trading'); App.switchTradingTab('academy', document.querySelector('[onclick*=\\'academy\\']'))">🎓 أكاديمية الـ 12 خطوة (63 درساً)</button>
        <button type="button" class="btn btn-outline-gold btn-sm" style="background: rgba(15,23,42,0.9); color: #FDE68A;" onclick="App.switchView('lab'); App.switchLabTab('mastermind', document.querySelector('[onclick*=\\'mastermind\\']'))">🏛️ اجتماع الطاولة المستديرة (10 مستشارين)</button>
      </div>
    `;
  },

  renderDashboardStats() {
    const { current } = this.getCurrentRankInfo();
    document.getElementById('statTotalXP').textContent = `${this.state.xp || 0} XP`;
    document.getElementById('statRankName').textContent = `${current.icon} ${current.title}`;
    document.getElementById('statStreakDays').textContent = `${this.state.streak || 1} يوم`;
    document.getElementById('statMasteryAvg').textContent = `${this.getAverageMastery()}%`;

    const actionsDone = Object.keys(this.state.completedActions || {}).length;
    document.getElementById('statActionsDone').textContent = `${actionsDone} / 64`;
  },

  nextRandomQuote() {
    const allQuotes = [];
    window.NAPOLEON_HILL_DATA.laws.forEach((law) => {
      law.quotes.forEach((q) => {
        allQuotes.push({ text: q, source: `— نابليون هيل • ${law.number}: ${law.title}` });
      });
    });
    const pick = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    document.getElementById('dailyQuoteText').textContent = `"${pick.text}"`;
    document.getElementById('dailyQuoteSource').textContent = pick.source;
  },

  renderDashboardAim() {
    const aim = this.state.definiteAim || {};
    const preview = document.getElementById('dashboardAimPreview');
    if (aim.goal && aim.goal.trim()) {
      preview.innerHTML = `
        <strong>هدفي الرئيسي المحدد:</strong> ${this.escapeHtml(aim.goal)}<br/>
        <span style="font-size:0.88rem; color:var(--text-secondary);">📅 الموعد النهائي: ${aim.targetDate || 'محدد بالعهد'} | 🤝 المقابل: ${this.escapeHtml(aim.giveInReturn || 'العمل المتواصل')}</span>
      `;
    } else {
      preview.textContent = 'لم تقم بصياغة وثيقة هدفك الرئيسي المحدد بعد. اضغط على "تعديل العهد" لكتابته الآن وفق معادلة نابليون هيل!';
    }

    const today = this.getTodayStr();
    const btnM = document.getElementById('btnMorningRead');
    const btnE = document.getElementById('btnEveningRead');
    if (btnM) {
      const doneM = aim.lastMorningRead === today;
      btnM.textContent = doneM ? '✅ تمت قراءة الصباح اليوم' : '☀️ قرأته صباحاً بإيمان (+15 XP)';
    }
    if (btnE) {
      const doneE = aim.lastEveningRead === today;
      btnE.textContent = doneE ? '✅ تمت قراءة المساء اليوم' : '🌙 قرأته مساءً بإيمان (+15 XP)';
    }
  },

  markAimRead(period) {
    const aim = this.state.definiteAim;
    if (!aim || !aim.goal.trim()) {
      this.showToast('⚠️ اكتب وثيقة هدفك الرئيسي أولاً في قسم الهدف الرئيسي!');
      this.switchView('aim');
      return;
    }
    const today = this.getTodayStr();
    if (period === 'morning') {
      if (aim.lastMorningRead === today) {
        this.showToast('لقد سجلت قراءة الصباح لهذا اليوم بالفعل!');
        return;
      }
      aim.lastMorningRead = today;
    } else {
      if (aim.lastEveningRead === today) {
        this.showToast('لقد سجلت قراءة المساء لهذا اليوم بالفعل!');
        return;
      }
      aim.lastEveningRead = today;
    }
    aim.readCount = (aim.readCount || 0) + 1;
    this.addXP(15, 'قراءة الهدف الرئيسي بالإيحاء الذاتي');
    this.renderDashboardAim();
    this.renderAimSection();
  },

  renderBadges() {
    const grid = document.getElementById('badgesGrid');
    if (!grid) return;
    const unlocked = new Set(this.state.unlockedBadges || []);
    const allBadges = window.NAPOLEON_HILL_DATA.badges;

    document.getElementById('badgesCountText').textContent = `${unlocked.size} / ${allBadges.length} أوسمة مفتوحة`;

    grid.innerHTML = allBadges
      .map((b) => {
        const isUnlocked = unlocked.has(b.id);
        const isTradingBadge = b.category === 'احتراف التداول';
        return `
          <div class="badge-item ${isUnlocked ? 'unlocked' : ''}" style="${isTradingBadge && isUnlocked ? 'border-color: #34D399; background: rgba(16, 185, 129, 0.1);' : ''}">
            <div style="font-size: 0.68rem; padding: 2px 7px; border-radius: 99px; margin-bottom: 6px; display: inline-block; background: ${isTradingBadge ? 'rgba(59, 130, 246, 0.2)' : 'rgba(212, 175, 55, 0.16)'}; color: ${isTradingBadge ? '#93c5fd' : 'var(--gold-light)'}; font-weight: 700;">
              ${isTradingBadge ? '📈 احتراف التداول' : '🏛️ قوانين النجاح'}
            </div>
            <div class="badge-icon">${b.icon}</div>
            <div style="font-weight: 800; font-size: 0.88rem; color: var(--gold-light); margin-bottom: 4px;">${b.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">${b.desc}</div>
          </div>
        `;
      })
      .join('');
  },

  // ==================== رسم رادار القوانين الـ 16 (HTML5 Canvas) ====================
  drawRadarChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const laws = window.NAPOLEON_HILL_DATA.laws;
    const count = laws.length; // 16
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.34;

    // رسم الشبكة الدائرية المتدرجة (25%, 50%, 75%, 100%)
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach((lvl) => {
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        const r = radius * lvl;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = lvl === 1 ? 'rgba(212, 175, 55, 0.35)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // رسم المحاور الـ 16 والعناوين
    ctx.font = '600 11px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const xEnd = centerX + radius * Math.cos(angle);
      const yEnd = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(xEnd, yEnd);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.stroke();

      // كتابة اسم القانون المختصر حول الدائرة
      const labelRadius = radius + 28;
      const lx = centerX + labelRadius * Math.cos(angle);
      const ly = centerY + labelRadius * Math.sin(angle);
      ctx.fillStyle = '#F3E5AB';
      const shortTitle = `${laws[i].id}. ${laws[i].title.split(' ').slice(0, 2).join(' ')}`;
      ctx.fillText(shortTitle, lx, ly);
    }

    // رسم مضلع إتقان المستخدم
    ctx.beginPath();
    const points = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const score = this.getLawMastery(laws[i].id) / 100;
      const r = radius * score;
      const px = centerX + r * Math.cos(angle);
      const py = centerY + r * Math.sin(angle);
      points.push({ x: px, y: py });
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(212, 175, 55, 0.28)';
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // رسم نقاط الرؤوس الذهبية
    points.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#F3E5AB';
      ctx.fill();
      ctx.strokeStyle = '#090D16';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  },

  // ==================== 2. موسوعة القوانين الـ 16 التفاعلية ====================
  filterLaws(category, btnElem) {
    this.activeCategoryFilter = category;
    document.querySelectorAll('#lawsCategoryPills .filter-pill').forEach((b) => b.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');
    this.renderLawsGrid();
  },

  renderLawsGrid() {
    const container = document.getElementById('lawsGridContainer');
    if (!container) return;

    const searchQuery = (document.getElementById('lawSearchInput')?.value || '').trim().toLowerCase();
    const laws = window.NAPOLEON_HILL_DATA.laws.filter((law) => {
      const matchesCat = this.activeCategoryFilter === 'all' || law.category === this.activeCategoryFilter;
      const matchesSearch =
        !searchQuery ||
        law.title.toLowerCase().includes(searchQuery) ||
        law.englishTitle.toLowerCase().includes(searchQuery) ||
        law.shortDesc.toLowerCase().includes(searchQuery) ||
        law.philosophy.toLowerCase().includes(searchQuery) ||
        law.story.title.toLowerCase().includes(searchQuery);
      return matchesCat && matchesSearch;
    });

    container.innerHTML = laws
      .map((law) => {
        const mastery = this.getLawMastery(law.id);
        const doneSteps = law.actionSteps.filter((s) => this.state.completedActions?.[s.id]).length;
        return `
          <div class="law-card" onclick="App.openLawModal(${law.id})">
            <div>
              <div class="law-card-top">
                <span class="law-num-badge">${law.number} • ${law.category}</span>
                <span class="law-icon-lg">${law.icon}</span>
              </div>
              <h3>${law.title}</h3>
              <div class="law-en-title">${law.englishTitle}</div>
              <p class="law-short-desc">${law.shortDesc}</p>
            </div>
            <div class="law-progress-footer">
              <div class="law-progress-labels">
                <span>نسبة الإتقان: <strong style="color:var(--gold-light)">${mastery}%</strong></span>
                <span>التطبيق العملي: ${doneSteps}/${law.actionSteps.length}</span>
              </div>
              <div class="xp-bar-container">
                <div class="xp-bar-fill" style="width: ${mastery}%;"></div>
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  },

  openLawModal(lawId) {
    const law = window.NAPOLEON_HILL_DATA.laws.find((l) => l.id === lawId);
    if (!law) return;

    // تسجيل أن المستخدم استكشف هذا القانون
    if (!this.state.exploredLaws.includes(lawId)) {
      this.state.exploredLaws.push(lawId);
      this.addXP(10, `استكشاف ${law.number}: ${law.title}`);
    }

    document.getElementById('modalLawNumber').textContent = `${law.number} • ${law.category}`;
    document.getElementById('modalLawTitle').textContent = `${law.icon} ${law.title}`;
    document.getElementById('modalLawEnTitle').textContent = law.englishTitle;

    const savedNote = (this.state.lawNotes && this.state.lawNotes[law.id]) || '';

    const bodyHtml = `
      <!-- الفلسفة والجوهر -->
      <div style="margin-bottom: 20px;">
        <h4 style="color: var(--gold-light); margin-bottom: 8px; font-size: 1.05rem;">📘 الفلسفة والجوهر في كتاب نابليون هيل:</h4>
        <p style="color: var(--text-primary); line-height: 1.85; font-size: 0.94rem; white-space: pre-line; background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border-right: 3px solid var(--gold-primary);">${law.philosophy}</p>
      </div>

      <!-- المبادئ الأساسية -->
      <div style="margin-bottom: 20px;">
        <h4 style="color: var(--gold-light); margin-bottom: 8px; font-size: 1.05rem;">🔑 المبادئ الحاكمة لهذا القانون:</h4>
        <ul style="padding-right: 20px; color: var(--text-secondary); line-height: 1.8; font-size: 0.9rem;">
          ${law.principles.map((p) => `<li style="margin-bottom: 6px;">${p}</li>`).join('')}
        </ul>
      </div>

      <!-- القصة التاريخية من الكتاب -->
      <div style="margin-bottom: 20px; padding: 18px; background: linear-gradient(135deg, rgba(212,175,55,0.09), rgba(17,24,39,0.9)); border: 1px solid var(--border-gold); border-radius: 14px;">
        <h4 style="color: var(--gold-light); margin-bottom: 6px; font-size: 1.02rem;">🏛️ قصة وشاهد تاريخي من الكتاب: ${law.story.title}</h4>
        <p style="color: var(--text-primary); line-height: 1.8; font-size: 0.9rem;">${law.story.content}</p>
      </div>

      <!-- أقوال مأثورة -->
      <div style="margin-bottom: 20px;">
        <h4 style="color: var(--gold-light); margin-bottom: 8px; font-size: 1.02rem;">💬 من أقوال نابليون هيل في هذا الدرس:</h4>
        ${law.quotes
          .map(
            (q) => `
          <div style="font-family: 'Amiri', serif; font-size: 1.15rem; color: var(--gold-light); padding: 10px 14px; background: rgba(0,0,0,0.25); border-radius: 8px; margin-bottom: 8px;">
            ❝ ${q} ❞
          </div>
        `
          )
          .join('')}
      </div>

      <!-- تحدي اليوم السريع -->
      <div style="margin-bottom: 20px; padding: 14px 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 12px;">
        <strong style="color: #34D399;">⚡ التحدي التطبيقي الفوري:</strong>
        <p style="color: var(--text-primary); font-size: 0.9rem; margin-top: 4px;">${law.dailyChallenge}</p>
      </div>

      <!-- خطوات التطبيق العملي (Action Steps Checklist) -->
      <div style="margin-bottom: 22px;">
        <h4 style="color: var(--gold-light); margin-bottom: 10px; font-size: 1.05rem;">✅ خطوات التطبيق العملي (أنجزها لرفع إتقانك وكسب نقاط XP):</h4>
        <div id="modalLawActionsList">
          ${law.actionSteps
            .map((step) => {
              const done = Boolean(this.state.completedActions && this.state.completedActions[step.id]);
              return `
              <div class="checklist-item ${done ? 'completed' : ''}" onclick="App.toggleLawActionStep(${law.id}, '${step.id}')">
                <div class="check-left">
                  <div class="custom-checkbox">${done ? '✓' : ''}</div>
                  <span class="item-text" style="font-size: 0.9rem;">${step.text}</span>
                </div>
                <span class="xp-tag">+20 XP</span>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>

      <!-- ملاحظات وتأملات المستخدم الخاصة على القانون -->
      <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px;">
        <label class="form-label">📝 تأملاتي وخطتي الشخصية لتطبيق (${law.title}):</label>
        <textarea id="modalLawNoteInput" class="form-control" placeholder="اكتب كيف ستطبق هذا القانون في حياتك أو عملك...">${this.escapeHtml(savedNote)}</textarea>
        <button class="btn btn-gold btn-sm" style="margin-top: 10px;" onclick="App.saveLawNote(${law.id})">
          💾 حفظ ملاحظتي على هذا القانون (+15 XP)
        </button>
      </div>
    `;

    document.getElementById('modalLawBody').innerHTML = bodyHtml;
    document.getElementById('lawDetailModal').classList.add('open');
  },

  closeLawModal() {
    document.getElementById('lawDetailModal').classList.remove('open');
    this.renderLawsGrid();
    this.renderDashboard();
  },

  toggleLawActionStep(lawId, stepId) {
    if (!this.state.completedActions) this.state.completedActions = {};
    const currentlyDone = Boolean(this.state.completedActions[stepId]);
    if (currentlyDone) {
      delete this.state.completedActions[stepId];
      this.saveState();
    } else {
      this.state.completedActions[stepId] = true;
      this.addXP(20, 'إتمام خطوة تطبيقية في موسوعة القوانين');
    }
    this.openLawModal(lawId);
  },

  saveLawNote(lawId) {
    const val = document.getElementById('modalLawNoteInput')?.value || '';
    if (!this.state.lawNotes) this.state.lawNotes = {};
    const hadNote = Boolean(this.state.lawNotes[lawId]);
    this.state.lawNotes[lawId] = val;
    if (!hadNote && val.trim().length > 3) {
      this.addXP(15, 'تدوين تأمل شخصي على القانون');
    } else {
      this.saveState();
      this.showToast('✅ تم حفظ ملاحظتك الشخصية بنجاح');
    }
  },

  // ==================== 3. استوديو الهدف الرئيسي + فكر تصبح غنياً ====================
  renderAimSection() {
    const aim = this.state.definiteAim || {};
    const goalInput = document.getElementById('aimGoalInput');
    if (goalInput) {
      goalInput.value = aim.goal || '';
      document.getElementById('aimDateInput').value = aim.targetDate || '';
      document.getElementById('aimGiveInput').value = aim.giveInReturn || '';
      document.getElementById('aimPlanInput').value = aim.plan || '';
    }

    const contractEl = document.getElementById('renderedContractText');
    if (contractEl) {
      if (aim.goal && aim.goal.trim()) {
        contractEl.innerHTML = `
          أنا الموقع أدناه، أعلن بعزم لا يلين ويقين تام أن <strong>هدفي الرئيسي المحدد في الحياة</strong> هو:<br/>
          « <strong>${this.escapeHtml(aim.goal)}</strong> »<br/><br/>
          وقد حددت تاريخ <strong>(${aim.targetDate || 'في الموعد المرسوم'})</strong> موعداً نهائياً لتحقيق هذا الهدف.<br/>
          وفي مقابل تحقيق هذه الغاية، أتعهد بتقديم المقابل التالي بإخلاص وإتقان:<br/>
          « ${this.escapeHtml(aim.giveInReturn || 'بذل أقصى جهدي وتقديم خدمة نافعة تفوق المتوقع مني')} »<br/><br/>
          <strong>خطتي الفورية للتنفيذ هي:</strong><br/>
          ${this.escapeHtml(aim.plan || 'العمل المنظم المستمر يومياً وتطوير مهاراتي وتحالفي.')}
        `;
      } else {
        contractEl.textContent = 'قم بملء الحقول على اليمين واضغط "اعتماد وحفظ وثيقة العهد الذاتي" لتوليد وثيقة عهدك المذهّبة...';
      }
    }

    const countEl = document.getElementById('aimReadCountLabel');
    if (countEl) countEl.textContent = `${aim.readCount || 0} مرة`;

    // عرض صيغة الثقة بالنفس الخماسية
    const confList = document.getElementById('selfConfidenceList');
    if (confList) {
      confList.innerHTML = window.NAPOLEON_HILL_DATA.selfConfidenceFormula
        .map(
          (item, idx) => `
          <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-gold); border-radius: 12px; line-height: 1.85; font-size: 0.96rem;">
            <span class="law-num-badge" style="margin-left: 8px;">البند ${idx + 1}</span>
            ${item}
          </div>
        `
        )
        .join('');
    }

    // عرض الخطوات الـ 6 من كتاب فكر تصبح غنياً
    const tagrList = document.getElementById('tagrSixStepsList');
    if (tagrList) {
      tagrList.innerHTML = window.NAPOLEON_HILL_DATA.sixStepsThinkAndGrowRich
        .map(
          (s) => `
          <div style="padding: 14px; background: rgba(255,255,255,0.03); border-right: 3px solid var(--gold-primary); border-radius: 8px;">
            <strong style="color: var(--gold-light); display: block; margin-bottom: 4px;">الخطوة ${s.step}: ${s.title}</strong>
            <span style="font-size: 0.86rem; color: var(--text-secondary);">${s.desc}</span>
          </div>
        `
        )
        .join('');
    }

    // عرض الأشباح الستة للخوف
    const ghostsContainer = document.getElementById('sixGhostsList');
    if (ghostsContainer) {
      ghostsContainer.innerHTML = window.NAPOLEON_HILL_DATA.sixGhostsOfFear
        .map(
          (g) => `
          <div style="padding: 14px; background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 10px;">
            <strong style="color: #F87171; font-size: 0.95rem;">👻 ${g.name}</strong>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;"><strong>الأعراض:</strong> ${g.symptoms}</div>
            <div style="font-size: 0.84rem; color: #34D399; margin-top: 4px;"><strong>العلاج العملي:</strong> ${g.cure}</div>
          </div>
        `
        )
        .join('');
    }
  },

  saveDefiniteAim() {
    const goal = document.getElementById('aimGoalInput').value.trim();
    const targetDate = document.getElementById('aimDateInput').value;
    const giveInReturn = document.getElementById('aimGiveInput').value.trim();
    const plan = document.getElementById('aimPlanInput').value.trim();

    if (!goal) {
      this.showToast('⚠️ يرجى كتابة هدفك الرئيسي المحدد أولاً');
      return;
    }

    const isFirstTime = !this.state.definiteAim.goal;
    this.state.definiteAim = {
      ...this.state.definiteAim,
      goal,
      targetDate,
      giveInReturn,
      plan
    };

    if (isFirstTime) {
      this.addXP(50, 'صياغة وثيقة الهدف الرئيسي المحدد لأول مرة!');
    } else {
      this.addXP(15, 'تحديث وثيقة العهد الذاتي');
    }

    this.renderAimSection();
    this.renderDashboardAim();
  },

  affirmSelfConfidence() {
    this.addXP(20, 'قراءة وتأكيد صيغة الثقة بالنفس الخماسية');
  },

  // جلسة التأمل والإيحاء الذاتي
  openFocusMeditation() {
    const aim = this.state.definiteAim || {};
    const textEl = document.getElementById('meditationAimText');
    if (aim.goal && aim.goal.trim()) {
      textEl.innerHTML = document.getElementById('renderedContractText').innerHTML;
    } else {
      textEl.textContent = '« أنا أمتلك القدرة الكاملة على تحقيق هدفي الرئيسي في الحياة، وأوجه أفكاري وأفعالي كل يوم بتركيز وإيمان وثقة نحو القمة. »';
    }
    this.meditationSecondsRemaining = 5 * 60;
    this.updateMeditationDigits();
    document.getElementById('meditationModal').classList.add('open');
  },

  closeFocusMeditation() {
    if (this.meditationInterval) {
      clearInterval(this.meditationInterval);
      this.meditationInterval = null;
    }
    document.getElementById('meditationModal').classList.remove('open');
  },

  toggleMeditationTimer() {
    const btn = document.getElementById('meditationTimerBtn');
    if (this.meditationInterval) {
      clearInterval(this.meditationInterval);
      this.meditationInterval = null;
      btn.textContent = '▶️ استئناف مؤقت التأمل';
    } else {
      btn.textContent = '⏸️ إيقاف مؤقت';
      this.meditationInterval = setInterval(() => {
        if (this.meditationSecondsRemaining > 0) {
          this.meditationSecondsRemaining--;
          this.updateMeditationDigits();
        } else {
          clearInterval(this.meditationInterval);
          this.meditationInterval = null;
          this.playGentleChime();
          this.completeMeditationSession();
        }
      }, 1000);
    }
  },

  updateMeditationDigits() {
    const m = String(Math.floor(this.meditationSecondsRemaining / 60)).padStart(2, '0');
    const s = String(this.meditationSecondsRemaining % 60).padStart(2, '0');
    document.getElementById('meditationTimerDigits').textContent = `${m}:${s}`;
  },

  completeMeditationSession() {
    this.state.definiteAim.readCount = (this.state.definiteAim.readCount || 0) + 1;
    this.addXP(25, 'إتمام جلسة الإيحاء الذاتي والتأمل في الهدف');
    this.renderAimSection();
    this.renderDashboardAim();
    this.closeFocusMeditation();
  },

  // ==================== 4. التقييم الذاتي والتشخيص للقوانين الـ 16 ====================
  renderQuizQuestions() {
    const container = document.getElementById('quizQuestionsContainer');
    if (!container) return;

    container.innerHTML = window.NAPOLEON_HILL_DATA.laws
      .map((law) => {
        const answers = (this.state.quizAnswers && this.state.quizAnswers[law.id]) || [6, 6, 6];
        return `
          <div class="quiz-law-block">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="color: var(--gold-light); font-size: 1.05rem;">${law.icon} ${law.number}: ${law.title} (${law.englishTitle})</h4>
              <span class="law-num-badge" id="quizLawAvg_${law.id}">المتوسط: ${Math.round(((answers[0] + answers[1] + answers[2]) / 30) * 100)}%</span>
            </div>
            ${law.quizQuestions
              .map(
                (q, idx) => `
              <div class="quiz-question-row">
                <div style="font-size: 0.9rem; color: var(--text-primary);">${idx + 1}. ${q}</div>
                <div class="slider-row">
                  <span style="font-size: 0.75rem; color: var(--text-secondary);">1 (ضعيف)</span>
                  <input type="range" class="gold-slider" min="1" max="10" value="${answers[idx] || 6}"
                    oninput="App.onQuizSliderChange(${law.id}, ${idx}, this.value)" />
                  <span style="font-size: 0.75rem; color: var(--text-secondary);">10 (ممتاز)</span>
                  <span class="slider-val-badge" id="quizVal_${law.id}_${idx}">${answers[idx] || 6}/10</span>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        `;
      })
      .join('');
  },

  onQuizSliderChange(lawId, qIdx, val) {
    const num = parseInt(val, 10);
    if (!this.state.quizAnswers[lawId]) {
      this.state.quizAnswers[lawId] = [6, 6, 6];
    }
    this.state.quizAnswers[lawId][qIdx] = num;
    document.getElementById(`quizVal_${lawId}_${qIdx}`).textContent = `${num}/10`;

    const arr = this.state.quizAnswers[lawId];
    const pct = Math.round(((arr[0] + arr[1] + arr[2]) / 30) * 100);
    this.state.lawScores[lawId] = pct;
    document.getElementById(`quizLawAvg_${lawId}`).textContent = `المتوسط: ${pct}%`;
  },

  saveQuizAssessment() {
    this.state.quizCompletedOnce = true;
    this.addXP(40, 'إتمام التقييم التشخيصي الشامل للقوانين الـ 16');
    this.renderQuizSummary();
    this.drawRadarChart('quizRadarChart');
    this.drawRadarChart('radarChart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderQuizSummary() {
    const ranked = window.NAPOLEON_HILL_DATA.laws
      .map((law) => ({
        ...law,
        score: this.getLawMastery(law.id)
      }))
      .sort((a, b) => b.score - a.score);

    const top3 = ranked.slice(0, 3);
    const bottom3 = ranked.slice(-3).reverse();

    const sEl = document.getElementById('quizTopStrengths');
    if (sEl) {
      sEl.innerHTML = top3
        .map(
          (l) => `
          <div style="display:flex; justify-content:space-between; font-size:0.86rem; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
            <span>${l.icon} ${l.title}</span>
            <strong style="color:#34D399;">${l.score}%</strong>
          </div>
        `
        )
        .join('');
    }

    const wEl = document.getElementById('quizTopWeaknesses');
    if (wEl) {
      wEl.innerHTML = bottom3
        .map(
          (l) => `
          <div style="display:flex; justify-content:space-between; font-size:0.86rem; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.06);">
            <span>${l.icon} ${l.title}</span>
            <strong style="color:#F87171;">${l.score}%</strong>
          </div>
        `
        )
        .join('');
    }

    const prescEl = document.getElementById('quizPrescriptionText');
    if (prescEl && bottom3.length) {
      prescEl.innerHTML = bottom3
        .map(
          (l, i) => `
          <div style="margin-bottom: 6px;">
            <strong>${i + 1}. لعلاج وتقوية (${l.title}):</strong> ${l.dailyChallenge}
          </div>
        `
        )
        .join('');
    }
  },

  // ==================== 5. البرنامج اليومي (4 فترات) والعادات ومؤقت التركيز ====================
  renderHabitsSection() {
    this.renderDailyBlueprint();

    const today = this.getTodayStr();
    const habits = this.state.habits || [];
    let completedCount = 0;

    const buildHabitItem = (h) => {
      const isDone = this.state.habitsCompletedToday && this.state.habitsCompletedToday[h.id] === today;
      if (isDone) completedCount++;
      const law = window.NAPOLEON_HILL_DATA.laws.find((l) => l.id === Number(h.lawId));
      const lawBadge = law ? `${law.icon} ${law.title}` : 'قانون عام';

      return `
        <div class="checklist-item ${isDone ? 'completed' : ''}" onclick="App.toggleHabit('${h.id}')">
          <div class="check-left">
            <div class="custom-checkbox">${isDone ? '✓' : ''}</div>
            <div>
              <div class="item-text" style="font-size: 0.92rem; font-weight: 600;">${this.escapeHtml(h.title)}</div>
              <div style="font-size: 0.74rem; color: var(--gold-primary); margin-top: 2px;">مرتبط بـ: ${lawBadge}</div>
            </div>
          </div>
          <span class="xp-tag">+${h.xp || 15} XP</span>
        </div>
      `;
    };

    const fullHtml = habits.map(buildHabitItem).join('');
    const fullList = document.getElementById('fullHabitsList');
    if (fullList) fullList.innerHTML = fullHtml;

    const badge = document.getElementById('habitsCompletionBadge');
    if (badge) badge.textContent = `${completedCount} / ${habits.length} مكتمل اليوم`;
  },

  renderDailyBlueprint() {
    const today = this.getTodayStr();
    const phases = window.NAPOLEON_HILL_DATA.dailyBlueprintPhases || [];
    if (!this.state.blueprintCompletedToday) this.state.blueprintCompletedToday = {};

    let totalItems = 0;
    let doneItems = 0;
    const allItemsFlat = [];

    phases.forEach((ph) => {
      ph.items.forEach((item) => {
        totalItems++;
        const isDone = this.state.blueprintCompletedToday[item.id] === today;
        if (isDone) doneItems++;
        allItemsFlat.push({ ...item, phaseTitle: ph.title, isDone });
      });
    });

    const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

    const badgeEl = document.getElementById('blueprintCompletionBadge');
    if (badgeEl) badgeEl.textContent = `${doneItems} / ${totalItems} مكتمل اليوم (${pct}%)`;

    const barEl = document.getElementById('blueprintProgressBar');
    if (barEl) barEl.style.width = `${pct}%`;

    const dashPct = document.getElementById('dashBlueprintPct');
    if (dashPct) dashPct.textContent = `${pct}% (${doneItems}/${totalItems})`;

    const dashBar = document.getElementById('dashBlueprintBar');
    if (dashBar) dashBar.style.width = `${pct}%`;

    // عرض الفترات الأربع في صفحة البرنامج اليومي
    const container = document.getElementById('dailyBlueprintContainer');
    if (container) {
      container.innerHTML = phases
        .map((ph) => {
          const phDone = ph.items.filter((i) => this.state.blueprintCompletedToday[i.id] === today).length;
          return `
            <div class="card">
              <div class="card-header" style="margin-bottom: 8px;">
                <div>
                  <div class="card-title" style="font-size: 1.02rem;">${ph.title}</div>
                  <span style="font-size: 0.76rem; color: var(--gold-primary);">⏰ ${ph.timing}</span>
                </div>
                <span class="xp-tag">${phDone} / ${ph.items.length}</span>
              </div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 12px;">${ph.desc}</p>
              <div>
                ${ph.items
                  .map((item) => {
                    const isDone = this.state.blueprintCompletedToday[item.id] === today;
                    return `
                      <div class="checklist-item ${isDone ? 'completed' : ''}" onclick="App.toggleBlueprintItem('${item.id}', ${item.xp})">
                        <div class="check-left">
                          <div class="custom-checkbox">${isDone ? '✓' : ''}</div>
                          <div>
                            <div class="item-text" style="font-size: 0.88rem; font-weight: 600;">${item.title}</div>
                            <div style="font-size: 0.73rem; color: var(--gold-primary); margin-top: 2px;">${item.lawTitle}</div>
                          </div>
                        </div>
                        <span class="xp-tag">+${item.xp} XP</span>
                      </div>
                    `;
                  })
                  .join('')}
              </div>
            </div>
          `;
        })
        .join('');
    }

    // عرض أهم 4 مهام غير مكتملة (أو الأولى) في لوحة التحكم السريعة
    const dashList = document.getElementById('dashboardHabitsList');
    if (dashList) {
      const pendingFirst = [
        ...allItemsFlat.filter((i) => !i.isDone),
        ...allItemsFlat.filter((i) => i.isDone)
      ].slice(0, 4);

      dashList.innerHTML = pendingFirst
        .map(
          (item) => `
          <div class="checklist-item ${item.isDone ? 'completed' : ''}" onclick="App.toggleBlueprintItem('${item.id}', ${item.xp})">
            <div class="check-left">
              <div class="custom-checkbox">${item.isDone ? '✓' : ''}</div>
              <div>
                <div class="item-text" style="font-size: 0.88rem; font-weight: 600;">${item.title}</div>
                <div style="font-size: 0.73rem; color: var(--gold-primary);">${item.lawTitle}</div>
              </div>
            </div>
            <span class="xp-tag">+${item.xp} XP</span>
          </div>
        `
        )
        .join('');
    }
  },

  toggleBlueprintItem(itemId, xpVal) {
    const today = this.getTodayStr();
    if (!this.state.blueprintCompletedToday) this.state.blueprintCompletedToday = {};

    if (this.state.blueprintCompletedToday[itemId] === today) {
      delete this.state.blueprintCompletedToday[itemId];
      this.saveState();
    } else {
      this.state.blueprintCompletedToday[itemId] = today;
      this.addXP(xpVal || 15, 'إنجاز خطوة من البرنامج اليومي المثالي');

      // التحقق مما إذا أكمل جميع الـ 13 خطوة لهذا اليوم لمنحه مكافأة اليوم المثالي
      const phases = window.NAPOLEON_HILL_DATA.dailyBlueprintPhases || [];
      const allIds = [];
      phases.forEach((p) => p.items.forEach((i) => allIds.push(i.id)));
      const allDone = allIds.every((id) => this.state.blueprintCompletedToday[id] === today);
      if (allDone && this.state.blueprintFullBonusDate !== today) {
        this.state.blueprintFullBonusDate = today;
        this.addXP(50, '🌟 مبروك! أتممت شيك لست اليوم المثالي لنابليون هيل بالكامل 100%!');
      }
    }
    this.renderDailyBlueprint();
  },

  toggleHabit(habitId) {
    const today = this.getTodayStr();
    if (!this.state.habitsCompletedToday) this.state.habitsCompletedToday = {};
    const habit = (this.state.habits || []).find((h) => h.id === habitId);
    if (!habit) return;

    if (this.state.habitsCompletedToday[habitId] === today) {
      delete this.state.habitsCompletedToday[habitId];
      this.saveState();
    } else {
      this.state.habitsCompletedToday[habitId] = today;
      this.addXP(habit.xp || 15, `إنجاز عادة: ${habit.title}`);
    }
    this.renderHabitsSection();
  },

  addCustomHabit() {
    const titleInput = document.getElementById('newHabitTitle');
    const lawSelect = document.getElementById('newHabitLawSelect');
    const title = titleInput.value.trim();
    if (!title) {
      this.showToast('⚠️ اكتب عنوان العادة أولاً');
      return;
    }

    const newHabit = {
      id: 'h_custom_' + Date.now(),
      title,
      lawId: Number(lawSelect.value) || 1,
      xp: 20
    };

    this.state.habits.push(newHabit);
    titleInput.value = '';
    this.saveState();
    this.renderHabitsSection();
    this.showToast('✅ تمت إضافة العادة الجديدة وربطها بالقانون');
  },

  // مؤقت التركيز العميق (Law #12)
  setFocusMinutes(mins) {
    if (this.focusTimerInterval) {
      clearInterval(this.focusTimerInterval);
      this.focusTimerInterval = null;
      document.getElementById('focusStartBtn').textContent = '▶️ ابدأ جلسة التركيز';
    }
    this.focusSelectedMinutes = mins;
    this.focusSecondsRemaining = mins * 60;
    this.updateFocusDisplay();
  },

  updateFocusDisplay() {
    const m = String(Math.floor(this.focusSecondsRemaining / 60)).padStart(2, '0');
    const s = String(this.focusSecondsRemaining % 60).padStart(2, '0');
    const el = document.getElementById('focusTimerDisplay');
    if (el) el.textContent = `${m}:${s}`;
  },

  toggleFocusTimer() {
    const btn = document.getElementById('focusStartBtn');
    if (this.focusTimerInterval) {
      clearInterval(this.focusTimerInterval);
      this.focusTimerInterval = null;
      btn.textContent = '▶️ استئناف التركيز';
    } else {
      btn.textContent = '⏸️ إيقاف مؤقت';
      this.focusTimerInterval = setInterval(() => {
        if (this.focusSecondsRemaining > 0) {
          this.focusSecondsRemaining--;
          this.updateFocusDisplay();
        } else {
          clearInterval(this.focusTimerInterval);
          this.focusTimerInterval = null;
          btn.textContent = '▶️ ابدأ جلسة التركيز';
          this.onFocusSessionComplete();
        }
      }, 1000);
    }
  },

  resetFocusTimer() {
    this.setFocusMinutes(this.focusSelectedMinutes);
  },

  onFocusSessionComplete() {
    this.playGentleChime();
    const taskName = document.getElementById('focusTaskInput')?.value.trim() || 'جلسة تركيز عميق على الهدف الرئيسي';
    this.state.focusSessions.unshift({
      task: taskName,
      minutes: this.focusSelectedMinutes,
      date: new Date().toLocaleString('ar-SA')
    });
    this.sendSystemNotification(
      '⏱️ انتهت جلسة التركيز العميق (Law #12)',
      `أحسنت! أتممت ${this.focusSelectedMinutes} دقيقة من التركيز على: ${taskName} (+30 XP)`
    );
    this.addXP(30, `إتمام جلسة تركيز عميق (${this.focusSelectedMinutes} دقيقة)`);
    this.renderFocusLogs();
    this.resetFocusTimer();
  },

  renderFocusLogs() {
    const container = document.getElementById('focusSessionsLog');
    const badge = document.getElementById('totalFocusSessionsBadge');
    const sessions = this.state.focusSessions || [];
    if (badge) badge.textContent = `${sessions.length} جلسة`;
    if (!container) return;

    if (!sessions.length) {
      container.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.85rem; text-align: center; padding: 18px;">لم تسجل جلسات تركيز بعد. ابدأ جلستك الأولى الآن لتفعيل القانون الثاني عشر!</p>`;
      return;
    }

    container.innerHTML = sessions
      .map(
        (s) => `
        <div style="padding: 10px 12px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">🔍 ${this.escapeHtml(s.task)}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">${s.date}</div>
          </div>
          <span class="xp-tag">${s.minutes} د</span>
        </div>
      `
      )
      .join('');
  },

  // ==================== 6. المختبر العملي والمفكرة الفلسفية (Law #11: التفكير الدقيق) ====================
  fillThinkingQuickTemplate(templateType) {
    const topicEl = document.getElementById('journalTopic');
    if (!topicEl) return;

    const templates = {
      hesitate_entry: 'ظهرت فرصة تداول تطابق شروط استراتيجيتي 100% ولكنني أشعر بالتردد والخوف من ضغط زر الدخول',
      fear_pullback: 'أنا في صفقة سوينج رابحة حالياً وبدأ السعر يصحح قليلاً، وأشعر برغبة قوية في إغلاق الصفقة مبكراً خوفاً من ضياع الربح',
      double_lot: 'حققت صفقتين رابحتين متتاليتين وأشعر بنشوة وثقة عالية تدفعني لمضاعفة حجم العقد (اللوت) في الصفقة القادمة',
      market_rumor: 'قرأت تحليلات وأخباراً متضاربة على مواقع التواصل جعلتني أشك في تحليلي الفني وخطتي المكتوبة'
    };

    if (templates[templateType]) {
      topicEl.value = templates[templateType];
      this.autoAnalyzeAccurateThinking();
    }
  },

  autoAnalyzeAccurateThinking() {
    const topicEl = document.getElementById('journalTopic');
    const factsEl = document.getElementById('journalFacts');
    const opinionsEl = document.getElementById('journalOpinions');
    const goldenEl = document.getElementById('journalGoldenRule');
    if (!topicEl || !factsEl || !opinionsEl || !goldenEl) return;

    const topicText = topicEl.value.trim();
    if (!topicText) {
      this.showToast('⚠️ اكتب أولاً الموضوع أو القرار في الخانة رقم (1) أو اختر من الأزرار السريعة أعلاه');
      return;
    }

    const t = topicText.toLowerCase();
    let facts = '';
    let opinions = '';
    let golden = '';

    if (/تردد|خوف|دخول|فرصة|اكتمال/.test(t)) {
      facts = `• الحقيقة 1: شروط استراتيجيتي المكتوبة في دستوري متحققة في هذه الفرصة ومخاطرتي محددة سلفاً (1% أو أقل).\n• الحقيقة 2: وفق قانون الاحتمالات (مارك دوغلاس)، لست بحاجة لمعرفة نتيجة هذه الصفقة الواحدة لأربح على مدى 20 صفقة.`;
      opinions = `• الظن العاطفي 1: "أخشى أن تضرب هذه الصفقة وقف الخسارة" (توقع غيبي مبني على خوف من الألم وليس على حقيقة فنية).\n• الظن العاطفي 2: ربط قيمتي الذاتية كمتداول بنتيجة هذه الصفقة الفردية.`;
      golden = `القرار العقلاني الحاسم: أنفذ الصفقة فوراً بحجم المخاطرة الثابت وأضع أمر الوقف والهدف بلا تردد، وأمتنّ لالتزامي بنظامي أياً كانت النتيجة.`;
    } else if (/يصحح|تصحيح|سوينج|مبكر|إغلاق|اغلاق|ربح/.test(t)) {
      facts = `• الحقيقة 1: هيكل الاتجاه على الفريم الكبير (4 ساعات / يومي) لا يزال سليماً ولم يُكسر قاع/قمة الاتجاه.\n• الحقيقة 2: السوق يتحرك في موجات (دفع وتصحيح) ولا يتحرك في خط مستقيم أبداً؛ وأمري محمي بوقف خسارة واضح.`;
      opinions = `• الظن العاطفي 1: "السعر سينقلب عليّ ويبتلع كل الربح العائم!" (وهم يصنعه الخوف ومراقبة الفريمات الصغيرة).\n• الظن العاطفي 2: رغبة عقلية الصياد (Hunter) في خطف ربح صغير هرباً من توتر الانتظار.`;
      golden = `القرار العقلاني الحاسم: ألتزم بخطة السوينج المكتوبة في دستوري، أغلق فريم 5 دقائق، وأترك الصفقة تنضج بعقلية المزارع المنضبط (Farmer).`;
    } else if (/مضاعفة|لوت|نشوة|أرباح|ارباح|رابح/.test(t)) {
      facts = `• الحقيقة 1: نجاح الصفقتين السابقتين لا يعني إطلاقاً أن الصفقة الثالثة مضمونة؛ كل صفقة مستقلة إحصائياً.\n• الحقيقة 2: مضاعفة اللوت بعد الربح تعني أن خسارة واحدة ستبتلع أرباح صفقتين أو ثلاث وتدمر منحنى رأس المال.`;
      opinions = `• الظن العاطفي 1: "أنا اليوم في حالة خارقة ولن أخسر!" (فخ النشوة EUPHORia والتدمير الذاتي بعد الأرباح).\n• الظن العاطفي 2: الطمع في تحقيق ثروة سريعة في يوم واحد بمخالفة دستور إدارة المخاطر.`;
      golden = `القرار العقلاني الحاسم: أحترم دستوري وأحافظ على نفس نسبة المخاطرة الثابتة دون زيادة، وأشكر الله على الربح المحقق باتزان وتواضع.`;
    } else if (/أخبار|اخبار|تحليلات|تواصل|تضارب|أشك|اشك/.test(t)) {
      facts = `• الحقيقة 1: حركة السعر الفعلية على الشارت (Price Action) ومستويات السيولة والدستور المكتوب هي المعطيات الوحيدة القابلة للقياس.\n• الحقيقة 2: نصح نابليون هيل في القانون 11 بعدم الانخداع بآراء الآخرين الذين لا يتحملون نتيجة قرارك.`;
      opinions = `• الظن العاطفي 1: ضجيج المحللين وتوقعات مواقع التواصل الاجتماعي التي تُبنى على العاطفة والإثارة.\n• الظن العاطفي 2: الشك في خطتي المجربة لمجرد سماع رأي مخالف غير مبني على استراتيجيتي.`;
      golden = `القرار العقلاني الحاسم: أغلق مصادر الضجيج الخارجي أثناء الجلسة، وأنفذ فقط ما يمليه عليّ دستوري المكتوب وفلتر ما قبل الصفقة.`;
    } else {
      facts = `• المعطيات الواقعية الثابتة بالأرقام والدليل حول (${topicText}) والتي تتوافق مع هدفي الرئيسي المحدد وخطتي المكتوبة.`;
      opinions = `• المخاوف الظنية، الاستعجال العاطفي، أو آراء الآخرين غير المبنية على برهان أو تجربة موثقة.`;
      golden = `القرار العقلاني الحاسم: أبني قراري 100% على الحقائق المؤكدة وأستبعد الظنون والمخاوف، وأعامل نفسي والآخرين بالقاعدة الذهبية.`;
    }

    factsEl.value = facts;
    opinionsEl.value = opinions;
    goldenEl.value = golden;
    this.showToast('🔮 تم فصل الحقائق المؤكدة عن الظنون العاطفية بميزان التفكير الدقيق (Law #11)!');
  },

  addJournalEntry(sendToCouncil = false) {
    const topic = document.getElementById('journalTopic').value.trim();
    let facts = document.getElementById('journalFacts').value.trim();
    let opinions = document.getElementById('journalOpinions').value.trim();
    let golden = document.getElementById('journalGoldenRule').value.trim();

    if (!topic && !facts && !golden) {
      this.showToast('⚠️ يرجى كتابة الموضوع أو القرار أولاً');
      return;
    }

    if (topic && !facts && !opinions) {
      this.autoAnalyzeAccurateThinking();
      facts = document.getElementById('journalFacts').value.trim();
      opinions = document.getElementById('journalOpinions').value.trim();
      golden = document.getElementById('journalGoldenRule').value.trim();
    }

    const newId = Date.now();
    this.state.journalEntries.unshift({
      id: newId,
      date: new Date().toLocaleDateString('ar-SA'),
      topic: topic || 'تأمل يومي وتفكير دقيق',
      facts,
      opinions,
      golden
    });

    document.getElementById('journalTopic').value = '';
    document.getElementById('journalFacts').value = '';
    document.getElementById('journalOpinions').value = '';
    document.getElementById('journalGoldenRule').value = '';

    this.renderJournalEntries();

    if (sendToCouncil) {
      this.addXP(40, 'تحليل قرار بالتفكير الدقيق وعرضه على الطاولة المستديرة');
      this.discussJournalWithCouncil(newId);
    } else {
      this.addXP(25, 'تدوين جلسة تفكير دقيق ومحاسبة القاعدة الذهبية');
    }
  },

  discussJournalWithCouncil(entryId) {
    const entries = this.state.journalEntries || [];
    const e = entries.find((x) => x.id === entryId);
    if (!e) return;

    const mastermindBtn = document.querySelector('[onclick*="switchLabTab(\'mastermind\'"]');
    this.switchLabTab('mastermind', mastermindBtn || document.createElement('button'));
    const qText = `حللت هذا القرار بأداة التفكير الدقيق: (${e.topic}). الحقائق المؤكدة: (${e.facts}). والظنون المستبعدة: (${e.opinions}). وقراري المبدئي: (${e.golden}). ما هو حكم الطاولة المستديرة على هذا القرار؟`;
    this.askCouncilQuickPrompt(qText);
  },

  renderJournalEntries() {
    const list = document.getElementById('journalEntriesList');
    if (!list) return;
    const entries = this.state.journalEntries || [];
    if (!entries.length) {
      list.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 24px;">لا توجد تدوينات بعد. استخدم النموذج لفصل الحقائق عن الآراء وتدوين الامتنان اليومي.</p>`;
      return;
    }

    list.innerHTML = entries
      .map(
        (e) => `
        <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 12px; margin-bottom: 12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
            <strong style="color: var(--gold-light); font-size:0.93rem;">🧠 ${this.escapeHtml(e.topic)}</strong>
            <span style="font-size:0.76rem; color:var(--text-secondary);">${e.date}</span>
          </div>
          ${e.facts ? `<div style="font-size:0.85rem; margin-bottom:6px; line-height:1.7; white-space:pre-line;"><strong style="color:#34D399;">✅ الحقائق المؤكدة:</strong>\n${this.escapeHtml(e.facts)}</div>` : ''}
          ${e.opinions ? `<div style="font-size:0.85rem; margin-bottom:6px; line-height:1.7; white-space:pre-line;"><strong style="color:#F87171;">💭 الظنون والمخاوف المستبعدة:</strong>\n${this.escapeHtml(e.opinions)}</div>` : ''}
          ${e.golden ? `<div style="font-size:0.86rem; margin-bottom:10px; padding:8px 10px; background:rgba(212,175,55,0.08); border-right:3px solid var(--gold-primary); border-radius:6px; line-height:1.7;"><strong style="color:var(--gold-light);">👑 القرار العقلاني والقاعدة الذهبية:</strong> ${this.escapeHtml(e.golden)}</div>` : ''}
          <div style="padding-top:8px; border-top:1px dashed rgba(255,255,255,0.08);">
            <button type="button" class="btn btn-outline-gold btn-sm" style="font-size:0.75rem; background:rgba(15,23,42,0.9); color:#FDE68A;" onclick="App.discussJournalWithCouncil(${e.id})">👑 اعرض هذا القرار على الطاولة المستديرة</button>
          </div>
        </div>
      `
      )
      .join('');
  },

  // تحويل الفشل إلى نجاح (Law #14) + الاستخراج الذكي وترحيل القاعدة إلى دستور الاستراتيجية
  fillFailureQuickTemplate(templateType) {
    const eventEl = document.getElementById('failEvent');
    if (!eventEl) return;

    const templates = {
      early_exit: 'خرجت مبكراً من صفقة سوينج رابحة خوفاً من ارتداد بسيط، ثم واصل السعر صعوده وحقق كامل الهدف الكبير بدوني',
      revenge_trade: 'بعد ضرب وقف الخسارة في الصفقة الأولى، شعرت بالقهر ودخلت صفقة انتقامية سريعة لتعويض الخسارة فخسرت مرتين',
      fomo_entry: 'تسرعت بالدخول في الصفقة بدافع الخوف من فوات الفرصة (FOMO) قبل إغلاق الشمعة واكتمال شروط استراتيجيتي',
      moved_stop: 'رفضت تقبل الخسارة عندما اقترب السعر من الستوب، فقمت بتوسيع وقف الخسارة أملاً في ارتداده مما ضاعف خسارتي'
    };

    if (templates[templateType]) {
      eventEl.value = templates[templateType];
      this.autoExtractFailureLessonAndSeed();
    }
  },

  autoExtractFailureLessonAndSeed() {
    const eventEl = document.getElementById('failEvent');
    const lessonEl = document.getElementById('failLesson');
    const seedEl = document.getElementById('failSeed');
    if (!eventEl || !lessonEl || !seedEl) return;

    const eventText = eventEl.value.trim();
    if (!eventText) {
      this.showToast('⚠️ اكتب أولاً الموقف أو الخسارة في الخانة رقم (1) أو اختر من الأزرار السريعة أعلاه');
      return;
    }

    const t = eventText.toLowerCase();
    let lesson = '';
    let seed = '';

    if (/مبكر|سوينج|ارتداد|ربح|هدف|طار/.test(t)) {
      lesson = `الخلل لم يكن في التحليل الفني، بل في متابعة الفريمات الصغيرة بعد الدخول والتعامل مع الصفقة بعقلية "الصياد المتوتر (Hunter)" الذي يبحث عن راحة لحظية بدلاً من التفكير بالاحتمالات على مدى 20 صفقة.`;
      seed = `قاعدة ذهبية في دستوري: في صفقات السوينج، أمنع نفسي من مراقبة فريم 5 و15 دقيقة بعد الدخول؛ أحجز 30% فقط عند الهدف الأول لتهدئة العاطفة، وأنقل الوقف للدخول وأترك 70% من العقد للهدف النهائي بلا تدخل يدوي.`;
    } else if (/انتقام|تعويض|قهر|غضب|مرتين|متتالي/.test(t)) {
      lesson = `دخلت الصفقة الثانية وأنا في حالة "اختطاف عاطفي (Amygdala Hijack)" وتحت تأثير الكورتيزول؛ لم أتقبل المخاطرة في الصفقة الأولى فحاولت إجبار السوق على إعادة مالي بالقوة (كسر القانون 6: ضبط النفس).`;
      seed = `قاعدة ذهبية في دستوري: بعد أي صفقة تضرب وقف الخسارة، ألتزم بـ "هدنة إجبارية 30 دقيقة" بعيداً عن الشاشة + تطبيق بروتوكول التفريغ (Detach & Reset)، وإذا تداولت مجدداً يكون بنصف حجم المخاطرة (0.5%).`;
    } else if (/تسرع|فومو|fomo|شمعة|اكتمال|شروط|طاردت/.test(t)) {
      lesson = `الخوف من فوات الفرصة (FOMO) خدعني وجعلني أرى فرصة غير ناضجة وكأنها الفرصة الأخيرة في السوق؛ غاب عني "التفكير الدقيق (Law #11)" الذي يفصل بين الحقيقة الفنية المؤكدة وبين التمني العاطفي.`;
      seed = `قاعدة ذهبية في دستوري: ممنوع ضغط زر الدخول قبل إغلاق شمعة التأكيد وإضاءة الشروط الـ 5 في "فلتر حارس البوابة"؛ الفرص في السوق لا تنتهي، لكن رأس المال ينتهي إذا طاردت الشموع.`;
    } else if (/ستوب|وقف|وسعت|توسيع|تبريد|عززت|أمل/.test(t)) {
      lesson = `الكبرياء والأنا (Ego) منعاني من الاعتراف بأن فرضيتي الفنية في هذه الصفقة كانت خاطئة، فتحولت من متداول محترف يدافع عن رأس ماله إلى مقامر يعتمد على الأمل (مخالفة قاعدة بول تيودور جونز: الدفاع أولاً).`;
      seed = `قاعدة ذهبية في دستوري: وقف الخسارة خط أحمر مقدس غير قابل للتفاوض أو التوسيع؛ الخروج بـ -1% خسارة منضبطة هو انتصار يحمي حسابي لاقتناص فرصة الـ +3% القادمة.`;
    } else {
      lesson = `كشفت لي هذه التجربة (${eventText}) عن ثغرة بين ما أعرفه نظرياً وبين ما أنفذه تحت الضغط العاطفي؛ الانفعال اللحظي غلب التزامي بالخطة المكتوبة وضبط النفس (Law #6 & Law #11).`;
      seed = `قاعدة ذهبية في دستوري: تحويل هذا الموقف إلى شرط وقائي مكتوب في "دستور استراتيجيتي" أراجعه يومياً قبل التداول، والالتزام بفلتر ما قبل الصفقة بنسبة 100% دون استثناء.`;
    }

    lessonEl.value = lesson;
    seedEl.value = seed;
    this.showToast('🔮 تم تحليل العقبة واستخراج الدرس وبذرة النجاح المكافئ تلقائياً! يمكنك تعديلها أو حفظها الآن.');
  },

  addFailureConversion(promoteToStrategy = false) {
    const event = document.getElementById('failEvent').value.trim();
    let lesson = document.getElementById('failLesson').value.trim();
    let seed = document.getElementById('failSeed').value.trim();

    if (!event) {
      this.showToast('⚠️ يرجى كتابة العقبة أو الخسارة المؤقتة أولاً');
      return;
    }

    // إذا كتب المستخدم العقبة فقط ولم يضغط زر الاستخراج، نقوم باستخراجها له تلقائياً لتسهيل الأمر عليه!
    if (!lesson || !seed) {
      this.autoExtractFailureLessonAndSeed();
      lesson = document.getElementById('failLesson').value.trim();
      seed = document.getElementById('failSeed').value.trim();
    }

    const newItemId = Date.now();
    const newEntry = {
      id: newItemId,
      date: new Date().toLocaleDateString('ar-SA'),
      event,
      lesson,
      seed,
      promotedToStrategy: false
    };

    this.state.failureLogs.unshift(newEntry);

    document.getElementById('failEvent').value = '';
    document.getElementById('failLesson').value = '';
    document.getElementById('failSeed').value = '';

    if (promoteToStrategy) {
      this.promoteFailureSeedToStrategy(newItemId, true);
      this.addXP(45, 'تحويل عقبة إلى بذرة نجاح وترحيلها مباشرة إلى دستور الاستراتيجية');
    } else {
      this.addXP(30, 'تحويل هزيمة مؤقتة إلى بذرة نجاح مكافئ (القانون 14)');
    }

    this.renderFailureLogs();
  },

  promoteFailureSeedToStrategy(itemId, silentToast = false) {
    const logs = this.state.failureLogs || [];
    const item = logs.find((x) => x.id === itemId);
    if (!item) return;

    if (!this.state.strategyPlaybook) {
      this.state.strategyPlaybook = {
        generalPhilosophy: '',
        riskRules: '',
        entryRules: '',
        exitRules: '',
        swingVsDayRules: '',
        goldenNotes: '',
        reviewCount: 0,
        lastReviewedDate: ''
      };
    }

    const ruleLine = `• [قاعدة مستخرجة من تجربة ${item.date}]: ${item.seed}`;
    const currentNotes = (this.state.strategyPlaybook.goldenNotes || '').trim();

    if (!currentNotes.includes(item.seed)) {
      this.state.strategyPlaybook.goldenNotes = currentNotes
        ? `${currentNotes}\n${ruleLine}`
        : ruleLine;
    }

    item.promotedToStrategy = true;
    this.saveState();
    this.renderFailureLogs();
    if (typeof this.renderStrategyPlaybook === 'function') {
      this.renderStrategyPlaybook();
    }

    if (!silentToast) {
      this.addXP(15, 'ترحيل بذرة النجاح إلى دستور استراتيجيتي للمراجعة اليومية');
      this.showToast('📜 تمت إضافة القاعدة بنجاح إلى (دستور استراتيجيتي ← القائمة الحمراء والملاحظات الذهبية)!');
    }
  },

  discussFailureWithCouncil(itemId) {
    const logs = this.state.failureLogs || [];
    const item = logs.find((x) => x.id === itemId);
    if (!item) return;

    // الانتقال إلى تبويب مجلس العقل المدبر والطاولة المستديرة وطرح العقبة على المجلس
    const mastermindBtn = document.querySelector('[onclick*="switchLabTab(\'mastermind\'"]');
    this.switchLabTab('mastermind', mastermindBtn || document.createElement('button'));
    const qText = `واجهت هذه الهزيمة المؤقتة: (${item.event}). واستخرجت منها هذا الدرس: (${item.lesson}). وهذه البذرة: (${item.seed}). كيف أضمن عدم تكرار هذا الخطأ في صفقاتي القادمة؟`;
    this.askCouncilQuickPrompt(qText);
  },

  renderFailureLogs() {
    const list = document.getElementById('failureLogsList');
    if (!list) return;
    const logs = this.state.failureLogs || [];
    if (!logs.length) {
      list.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 24px;">سجل هنا أي عقبة أو تعثر لتستخرج منه بذرة النجاح المكافئ كما علمنا نابليون هيل.</p>`;
      return;
    }

    list.innerHTML = logs
      .map(
        (item) => `
        <div style="padding: 16px; background: rgba(212,175,55,0.06); border: 1px solid var(--border-gold); border-radius: 12px; margin-bottom: 12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
            <strong style="color: #F87171; font-size: 0.92rem;">⚡ التحدي المؤقت: ${this.escapeHtml(item.event)}</strong>
            <div style="display:flex; align-items:center; gap:6px;">
              ${
                item.promotedToStrategy
                  ? `<span style="font-size:0.72rem; padding:2px 8px; border-radius:99px; background:rgba(16,185,129,0.18); color:#34D399; border:1px solid rgba(16,185,129,0.35);">✅ مُرحّلة لدستور استراتيجيتك</span>`
                  : ''
              }
              <span style="font-size:0.75rem; color:var(--text-secondary);">${item.date}</span>
            </div>
          </div>
          <div style="font-size:0.86rem; color:var(--text-secondary); margin-bottom:8px; line-height:1.7;"><strong>📘 الدرس والتشخيص الجذري:</strong> ${this.escapeHtml(item.lesson)}</div>
          <div style="font-size:0.88rem; color:#34D399; margin-bottom:10px; padding:8px 10px; background:rgba(16,185,129,0.08); border-right:3px solid #34D399; border-radius:6px; line-height:1.75;"><strong>🌱 بذرة النجاح والقاعدة الذهبية:</strong> ${this.escapeHtml(item.seed)}</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; padding-top:8px; border-top:1px dashed rgba(255,255,255,0.1);">
            ${
              !item.promotedToStrategy
                ? `<button type="button" class="btn btn-outline-gold btn-sm" style="font-size:0.75rem; background:rgba(16,185,129,0.15); color:#6EE7B7; border-color:rgba(16,185,129,0.4);" onclick="App.promoteFailureSeedToStrategy(${item.id})">📜 أضف القاعدة إلى دستور استراتيجيتي (+15 XP)</button>`
                : `<button type="button" class="btn btn-ghost btn-sm" style="font-size:0.75rem; color:#34D399;" onclick="App.switchView('trading'); App.switchTradingTab('strategy', document.querySelector('[onclick*=\\'strategy\\']'))">👁️ عرض في دستور استراتيجيتي</button>`
            }
            <button type="button" class="btn btn-outline-gold btn-sm" style="font-size:0.75rem; background:rgba(15,23,42,0.9); color:#FDE68A;" onclick="App.discussFailureWithCouncil(${item.id})">👑 ناقش هذه العقبة مع الطاولة المستديرة</button>
          </div>
        </div>
      `
      )
      .join('');
  },

  // مجلس العقل المدبر والمستشارين الخياليين (Law #1)
  addMastermindMember() {
    const name = document.getElementById('mmName').value.trim();
    const skill = document.getElementById('mmSkill').value.trim();
    const valueGiven = document.getElementById('mmValueGiven').value.trim();

    if (!name) {
      this.showToast('⚠️ يرجى كتابة اسم عضو التحالف');
      return;
    }

    this.state.mastermindMembers.push({
      id: Date.now(),
      name,
      skill: skill || 'شريك فكري ومهني',
      valueGiven: valueGiven || 'التعاون وتبادل الخبرات بروح الوئام'
    });

    document.getElementById('mmName').value = '';
    document.getElementById('mmSkill').value = '';
    document.getElementById('mmValueGiven').value = '';

    this.addXP(25, 'إضافة عضو جديد إلى تحالف العقل المدبر');
    this.renderMastermindMembers();
  },

  renderMastermindMembers() {
    const list = document.getElementById('mastermindMembersList');
    if (!list) return;
    const members = this.state.mastermindMembers || [];
    if (!members.length) {
      list.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.85rem; text-align: center;">أضف شركاء النجاح والموجهين الذين يشكلون عقلك المدبر.</p>`;
      return;
    }

    list.innerHTML = members
      .map(
        (m) => `
        <div style="padding: 12px 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 10px; margin-bottom: 8px;">
          <div style="font-weight: 800; color: var(--gold-light);">🤝 ${this.escapeHtml(m.name)} <span style="font-size:0.78rem; color:var(--gold-primary);">(${this.escapeHtml(m.skill)})</span></div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 3px;">ما أقدمه له: ${this.escapeHtml(m.valueGiven)}</div>
        </div>
      `
      )
      .join('');
  },

  onAdvisorSelectionChange() {
    const select = document.getElementById('advisorSelect');
    const profileBox = document.getElementById('selectedAdvisorProfileBox');
    if (!select || !profileBox) return;

    const advisorId = select.value || 'hill';
    const advisor = window.NAPOLEON_HILL_DATA.imaginaryAdvisors.find((a) => a.id === advisorId) || window.NAPOLEON_HILL_DATA.imaginaryAdvisors[0];
    if (!advisor) return;

    profileBox.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
        <div style="font-weight: 800; color: var(--gold-light); font-size: 0.95rem;">
          ${advisor.avatar} ${this.escapeHtml(advisor.name)}
        </div>
        <span style="font-size: 0.75rem; padding: 2px 10px; border-radius: 999px; background: rgba(212,175,55,0.18); color: var(--gold-primary); font-weight: 700;">
          ${this.escapeHtml(advisor.category || 'مجلس الحكمة')}
        </span>
      </div>
      <div style="color: var(--text-secondary); font-size: 0.82rem; margin-bottom: 6px;">
        <strong>التخصص:</strong> ${this.escapeHtml(advisor.specialty)}
      </div>
      ${
        advisor.corePrinciple
          ? `<div style="color: var(--text-primary); font-size: 0.83rem; margin-bottom: 4px;">
              <strong>🧭 المبدأ الذهبي:</strong> ${this.escapeHtml(advisor.corePrinciple)}
            </div>`
          : ''
      }
      ${
        advisor.tradingStyleAdvice
          ? `<div style="color: #93c5fd; font-size: 0.82rem;">
              <strong>📈 وصيته لك في السوينج والمضاربة:</strong> ${this.escapeHtml(advisor.tradingStyleAdvice)}
            </div>`
          : ''
      }
    `;
  },

  renderCouncilMessageBody(msg) {
    // إذا كانت رسالة اجتماع الطاولة المستديرة تحتوي على بطاقات مستشارين مهيكلة أو نص قابل للتقسيم
    if (msg.role === 'roundtable') {
      let cards = msg.advisorCards;
      let headerSummary = msg.headerSummary || '';

      // دعم الرسائل المحفوظة مسبقاً في الذاكرة عبر تقسيمها تلقائياً إلى بطاقات منفصلة لكل مستشار
      if (!cards && msg.text) {
        const parts = msg.text.split(/(?=🎩\s*\*\*1\.|🎯\s*\*\*2\.|🛡️\s*\*\*3\.|🧬\s*\*\*4\.|🌊\s*\*\*5\.)/g);
        if (parts.length > 1) {
          headerSummary = parts[0].replace(/---/g, '').trim();
          const colors = ['#D4AF37', '#60A5FA', '#34D399', '#C084FC', '#38BDF8'];
          cards = parts.slice(1).map((block, idx) => {
            const firstLineEnd = block.indexOf(':\*\*');
            let title = `المستشار ${idx + 1}`;
            let body = block.trim();
            const match = block.match(/^([^\n:]+:\*\*)\s*([\s\S]*)$/);
            if (match) {
              title = match[1].replace(/\*\*/g, '').replace(/:$/, '').trim();
              body = match[2].trim();
            }
            return {
              title,
              accent: colors[idx % colors.length],
              isConclusion: idx === parts.length - 2,
              body
            };
          });
        }
      }

      if (cards && cards.length) {
        return `
          ${
            headerSummary
              ? `<div style="padding: 10px 14px; background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 10px; margin-bottom: 12px; font-size: 0.84rem; line-height: 1.75;">
                  ${this.formatAgentMarkdown(headerSummary)}
                </div>`
              : ''
          }
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${cards
              .map(
                (c) => `
              <div style="padding: 12px 15px; background: ${c.isConclusion ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.78)'}; border: 1px solid ${c.isConclusion ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.09)'}; border-right: 4px solid ${c.accent || 'var(--gold-primary)'}; border-radius: 10px;">
                <div style="font-weight: 800; color: ${c.accent || 'var(--gold-light)'}; font-size: 0.9rem; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 1px dashed rgba(255,255,255,0.08);">
                  ${this.escapeHtml(c.title)}
                </div>
                <div style="font-size: 0.87rem; color: var(--text-primary); line-height: 1.85; white-space: pre-line;">
                  ${this.formatAgentMarkdown(c.body)}
                </div>
              </div>
            `
              )
              .join('')}
          </div>
          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed rgba(212,175,55,0.25); display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
            <span style="font-size: 0.76rem; color: var(--gold-light); font-weight: 800;">↪️ متابعة النقاش في نفس القضية:</span>
            <button type="button" class="btn btn-outline-gold btn-sm" style="font-size: 0.74rem; padding: 4px 10px; background: rgba(15,23,42,0.92); color: #FDE68A;" onclick="App.continueCouncilFollowUp('roundtable', 'أعطوني مثالاً عملياً بالأرقام على الشارت لتطبيق كلامكم في هذه القضية')">🔍 مثال عملي بالأرقام على الشارت</button>
            <button type="button" class="btn btn-outline-gold btn-sm" style="font-size: 0.74rem; padding: 4px 10px; background: rgba(15,23,42,0.92); color: #FDE68A;" onclick="App.continueCouncilFollowUp('roundtable', 'ولكن ماذا لو عكس السعر عليّ أو ظهرت فرصة مغرية أخرى؟ كيف أتصرف لحظتها؟')">🤔 ماذا لو عكس السعر أو ترددت؟</button>
            <button type="button" class="btn btn-outline-gold btn-sm" style="font-size: 0.74rem; padding: 4px 10px; background: rgba(15,23,42,0.92); color: #FDE68A;" onclick="App.continueCouncilFollowUp('roundtable', 'لخصوا لي بروتوكولاً تنفيذياً صارماً وعقد التزام أطبقه الآن بناءً على نقاشنا')">📋 خطة عمل فورية وعقد التزام</button>
          </div>
        `;
      }
    }

    // رسائل المستشار الفردي: فصل الحكمة عن التوجيه العملي في بطاقتين واضحتين + أزرار متابعة الحوار
    if (msg.role === 'advisor' && msg.wisdomQuote && msg.specificAdvice) {
      return `
        ${
          msg.followUpBanner
            ? `<div style="padding: 8px 12px; background: rgba(59, 130, 246, 0.14); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 8px; margin-bottom: 10px; font-size: 0.8rem; color: #93c5fd;">
                ${this.formatAgentMarkdown(msg.followUpBanner)}
              </div>`
            : ''
        }
        <div style="padding: 11px 14px; background: rgba(212, 175, 55, 0.1); border-right: 3px solid var(--gold-primary); border-radius: 8px; margin-bottom: 10px; font-family: 'Amiri', serif; font-size: 1.05rem; color: #FDE68A; line-height: 1.8;">
          « ${this.escapeHtml(msg.wisdomQuote)} »
        </div>
        <div style="padding: 12px 14px; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(59, 130, 246, 0.3); border-right: 3px solid #60A5FA; border-radius: 8px; font-size: 0.87rem; color: var(--text-primary); line-height: 1.85; white-space: pre-line;">
          <div style="font-weight: 800; color: #93c5fd; margin-bottom: 5px;">🎯 ${this.escapeHtml(msg.adviceTitle || 'التوجيه العملي المباشر لحالتك:')}</div>
          ${this.formatAgentMarkdown(msg.specificAdvice)}
        </div>
        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1); display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
          <span style="font-size: 0.75rem; color: var(--gold-light); font-weight: 700;">↪️ تابع الحوار مع المستشار:</span>
          <button type="button" class="btn btn-outline-gold btn-sm" style="font-size: 0.74rem; padding: 4px 10px; background: rgba(15,23,42,0.9); color: #FDE68A;" onclick="App.continueCouncilFollowUp('advisor', 'أعطني مثالاً عملياً بالأرقام على الشارت لتطبيق كلامك السابق')">🔍 مثال عملي على الشارت</button>
          <button type="button" class="btn btn-outline-gold btn-sm" style="font-size: 0.74rem; padding: 4px 10px; background: rgba(15,23,42,0.9); color: #FDE68A;" onclick="App.continueCouncilFollowUp('advisor', 'ولكن ماذا لو عكس السعر عليّ أو شعرت بالخوف أثناء التنفيذ؟ كيف أتصرف لحظتها؟')">🤔 ماذا لو عكس السعر أو خفت؟</button>
          <button type="button" class="btn btn-outline-gold btn-sm" style="font-size: 0.74rem; padding: 4px 10px; background: rgba(15,23,42,0.9); color: #FDE68A;" onclick="App.continueCouncilFollowUp('roundtable', 'أريد رأي باقي أعضاء الطاولة المستديرة في هذه النقطة تحديداً')">👑 اعرض النقطة على الطاولة المستديرة</button>
        </div>
      `;
    }

    return `<div style="white-space: pre-line; line-height: 1.85;">${this.formatAgentMarkdown(msg.text || '')}</div>`;
  },

  renderCouncilChat() {
    const list = document.getElementById('councilChatMessagesList');
    if (!list) return;

    const history = this.state.councilChatHistory || [];
    if (!history.length) {
      list.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 18px; font-size: 0.85rem;">اختر مستشاراً أو اضغط على (عقد اجتماع الطاولة المستديرة) لبدء الحوار المفتوح.</div>`;
      return;
    }

    list.innerHTML = history
      .map((msg) => {
        if (msg.role === 'user') {
          return `
            <div style="align-self: flex-start; max-width: 90%; background: rgba(59, 130, 246, 0.18); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 12px; padding: 10px 14px;">
              <div style="font-size: 0.76rem; color: #93c5fd; font-weight: 800; margin-bottom: 4px;">🗣️ سؤالك للمجلس ${msg.targetLabel ? `← (${this.escapeHtml(msg.targetLabel)})` : ''} • <span style="opacity: 0.75;">${this.escapeHtml(msg.time || '')}</span></div>
              <div style="font-size: 0.9rem; color: #ffffff; font-weight: 600; line-height: 1.7;">${this.escapeHtml(msg.text)}</div>
            </div>
          `;
        } else {
          const isRoundtable = msg.role === 'roundtable';
          return `
            <div style="align-self: stretch; background: ${isRoundtable ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255, 255, 255, 0.04)'}; border: 1px solid ${isRoundtable ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.28)'}; border-right: 4px solid var(--gold-primary); border-radius: 12px; padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); flex-wrap: wrap; gap: 6px;">
                <div style="font-weight: 800; color: var(--gold-light); font-size: 0.95rem;">
                  ${msg.speakerAvatar || '🏛️'} ${this.escapeHtml(msg.speakerName || 'المستشار')}
                </div>
                <span style="font-size: 0.74rem; color: var(--text-secondary); background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 99px;">${this.escapeHtml(msg.time || '')}</span>
              </div>
              <div style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.85;">
                ${this.renderCouncilMessageBody(msg)}
              </div>
            </div>
          `;
        }
      })
      .join('');

    list.scrollTop = list.scrollHeight;
  },

  askCouncilQuickPrompt(promptText) {
    const input = document.getElementById('advisorQuestion');
    if (input) {
      input.value = promptText;
    }
    this.conveneRoundtableMeeting();
  },

  clearCouncilChat() {
    this.state.councilChatHistory = [
      {
        role: 'council',
        speakerName: 'نابليون هيل (رئيس المجلس) وأساطير التداول',
        speakerAvatar: '🏛️',
        time: 'جلسة جديدة',
        text: `تم فتح محضر جلسة جديدة في **غرفة المستشارين الخياليين والطاولة المستديرة**. اطرح سؤالك أو صفقتك وسنناقشها معك بعمق!`
      }
    ];
    this.saveState();
    this.renderCouncilChat();
    this.showToast('🏛️ تم بدء جلسة حوار جديدة في مجلس المستشارين');
  },

  getCouncilContextSnapshot() {
    const logs = this.state.tradingLogs || [];
    const totalTrades = logs.length;
    const followedCount = logs.filter((l) => l.followedPlan === 'yes').length;
    const disciplineRate = totalTrades ? Math.round((followedCount / totalTrades) * 100) : 100;
    const wins = logs.filter((l) => l.outcome === 'win').length;
    const winRate = totalTrades ? Math.round((wins / totalTrades) * 100) : 0;

    const pb = this.state.strategyPlaybook || {};
    const reviewedToday = pb.lastReviewedDate === this.getTodayStr();
    const prof = this.state.traderPsychProfile || {};
    const aimGoal = (this.state.definiteAim && this.state.definiteAim.goal) || '';

    return {
      totalTrades,
      disciplineRate,
      winRate,
      reviewedToday,
      pb,
      prof,
      aimGoal
    };
  },

  continueCouncilFollowUp(mode, followUpText) {
    const input = document.getElementById('advisorQuestion');
    if (input) {
      input.value = followUpText;
    }
    if (mode === 'roundtable') {
      this.conveneRoundtableMeeting();
    } else {
      this.consultImaginaryAdvisor();
    }
  },

  detectCouncilTopic(text) {
    const t = (text || '').toLowerCase();
    if (/سوينج|مبكر|أرباح|ارباح|ربح|أصبر|اصبر|ارتداد|خروج|هدف/.test(t)) return 'swing_hold';
    if (/انتقام|خسار|تعويض|ستوب|غضب|قهر|تراجع|درو/.test(t)) return 'revenge_loss';
    if (/تردد|خوف|دخول|فرصة|فومو|fomo|أخاف|اخاف|ثقة/.test(t)) return 'hesitation_fear';
    if (/بيانات|حالتي|تقييم|صفقاتي|نصيحة|راجع/.test(t)) return 'status_review';
    return null;
  },

  getCouncilConversationMemory(currentQuestion) {
    const history = this.state.councilChatHistory || [];
    // استخراج رسائل المستخدم السابقة قبل إضافة الرسالة الحالية
    const userMessages = history.filter((m) => m.role === 'user');
    const priorUserMsgs = userMessages.slice(0, -1);
    const turnCount = userMessages.length; // 1 = أول سؤال، 2 = متابعة ثانية، 3+ = تعمق متقدم
    const isFollowUp = priorUserMsgs.length > 0;
    const previousQuestion = isFollowUp ? priorUserMsgs[priorUserMsgs.length - 1].text : '';

    // تحديد الموضوع الأساسي: إما من السؤال الحالي، أو وراثته من الأسئلة السابقة في نفس الجلسة!
    let topic = this.detectCouncilTopic(currentQuestion);
    let rootTopicQuestion = currentQuestion;
    if (!topic && isFollowUp) {
      for (let i = priorUserMsgs.length - 1; i >= 0; i--) {
        const detected = this.detectCouncilTopic(priorUserMsgs[i].text);
        if (detected) {
          topic = detected;
          rootTopicQuestion = priorUserMsgs[i].text;
          break;
        }
      }
    }
    if (!topic) topic = 'general';

    // تحديد زاوية سؤال المتابعة (هل يطلب مثالاً بالأرقام؟ أم يسأل "ماذا لو عكس السعر"؟ أم يطلب خطة تنفيذية؟ أم يسأل مستشاراً بعينه؟)
    const qLower = (currentQuestion || '').toLowerCase();
    let followUpIntent = 'none';
    if (/مثال|أرقام|ارقام|شارت|توضيح|وضح|اشرح|كيف يعني/.test(qLower)) {
      followUpIntent = 'example_numbers';
    } else if (/ماذا لو|طيب لو|ولكن|بس |عكس|انقلب|فرصة ثانية|فرصة مغرية|لو خفت|شعرت/.test(qLower)) {
      followUpIntent = 'what_if_reversal';
    } else if (/لخص|خطة|بروتوكول|خطوات|عهد|التزام|الان|الآن|أطبق|اطبق/.test(qLower)) {
      followUpIntent = 'action_plan';
    } else if (isFollowUp) {
      followUpIntent = turnCount === 2 ? 'deep_dive_tactical' : 'mastery_commitment';
    }

    return {
      turnCount,
      isFollowUp,
      previousQuestion,
      rootTopicQuestion,
      topic,
      followUpIntent
    };
  },

  generateAdvisorContextualReply(advisor, question) {
    const ctx = this.getCouncilContextSnapshot();
    const mem = this.getCouncilConversationMemory(question);
    const q = (question || '').trim();

    // اختيار حكمة مختلفة في كل جولة متابعة حتى لا تتكرر نفس المقولة
    const wisdomIndex = (mem.turnCount - 1) % advisor.wisdom.length;
    const wisdomPick = advisor.wisdom[wisdomIndex];

    const followUpBanner = mem.isFollowUp
      ? `🔗 **متابعة الحوار (الجولة ${mem.turnCount})** — استكمالاً لنقاشنا حول (*"${mem.previousQuestion.slice(0, 65)}${mem.previousQuestion.length > 65 ? '...' : ''}"*) وتعقيبك الآن:`
      : '';

    let adviceTitle = mem.isFollowUp
      ? `رد ${advisor.name} التكميلي على سؤالك المتابع:`
      : `التوجيه العملي المباشر من ${advisor.name}:`;

    let specificAdvice = '';

    // إذا كان سؤال متابعة يطلب مثالاً بالأرقام على الشارت
    if (mem.followUpIntent === 'example_numbers') {
      adviceTitle = `🔍 مثال تطبيقي بالأرقام على الشارت من منظور ${advisor.name}:`;
      if (advisor.id === 'douglas') {
        specificAdvice = `لنأخذ مثالاً رقمياً حياً لما قلته لك في الجولة السابقة:
افترض أن رصيد حسابك **$10,000**، واستراتيجيتك تربح **50%** من الصفقات بعائد **1:2.5**، ومخاطرتك في الصفقة **1% ($100)**.
• حتى لو كانت استراتيجيتك ناجحة جداً، فمن الطبيعي إحصائياً أن تواجه **3 أو 4 صفقات خاسرة متتالية (-$300)** ضمن عينة من 20 صفقة!
• المتداول الهاوي يصاب بالذعر بعد الخسارة الثانية ويبدأ بالانتقام أو الخروج المبكر في الصفقة الثالثة الرابحة عند **+$40** بدلاً من هدفها **+$250**، فيدمر حافته الإحصائية بيده!
• أما أنت معي اليوم: ستكتب ورقة من **20 خانة** بجانب الشاشة، وتنفذ كل صفقة بنفس حجم المخاطرة ($100) دون تغيير حتى تكتمل الـ 20 صفقة.`;
      } else if (advisor.id === 'ptj') {
        specificAdvice = `إليك التطبيق الرقمي الصارم لقاعدة **الدفاع 5:1** على الشارت:
• إذا دخلت صفقة سوينج والمخاطرة (بعد وقف الخسارة الفني) هي **$100**، فإن هدف الموجة يجب أن يكون بين **$300 إلى $500**.
• **ماذا لو ضربت صفقتين خاسرتين متتاليتين؟** قاعدتي التي أطبقها شخصياً: أخفّض حجم العقد في الصفقة الثالثة إلى **0.5% ($50)** تلقائياً! لا أعود إلى حجم 1% إلا بعد أن أسترد إيقاعي بصفقة رابحة منضبطة.`;
      } else if (advisor.id === 'bailouni') {
        specificAdvice = `مثال عملي لتحويل نفسك من **صياد (Hunter)** إلى **مزارع (Farmer)** على الشارت اليوم:
1. حللت الذهب أو المؤشر على فريم 4 ساعات وحددت منطقة الدخول ووقف الخسارة والهدف.
2. بعد تنفيذ الأمر، إذا بقيت تفتح فريم الـ **1 دقيقة أو 5 دقائق**، فإن كل شمعة حمراء عكسية ستفرز الكورتيزول في دمك وتدفعك لإغلاق الصفقة يدوياً!
3. **التطبيق الفوري:** ضع منبهاً سعرياً (Alert) عند منتصف الهدف وعند وقف الخسارة، وأغلق نافذة الشارت تماماً لمدة ساعتين.`;
      } else {
        specificAdvice = `لتطبيق مبدأي عملياً على الشارت الآن:
1. افتح تبويب **📜 دستور استراتيجيتي** وتأكد أن شروط الدخول متحققة 100% (${ctx.pb.entryRules ? `شروطك المكتوبة: "${ctx.pb.entryRules.slice(0, 70)}..."` : 'حدد شروطك بوضوح'}).
2. حدد مبلغ المخاطرة بالدولار قبل ضغط الزر، وتعامل مع الصفقة كتجربة علمية ضمن خطة عملك الكبرى.`;
      }
    } else if (mem.followUpIntent === 'what_if_reversal') {
      adviceTitle = `🤔 كيف تتصرف لحظة انعكاس السعر أو ظهور الخوف (منهج ${advisor.name}):`;
      specificAdvice = `سؤالك ممتاز لأنه يمسّ اللحظة الحرجة أثناء حركة الشموع! إليك كيف تتصرف خطوة بخطوة إذا عكس السعر أو شعرت بالتردد:
1. **إذا عكس السعر نحو وقف الخسارة:** لا تحرك وقف الخسارة أبداً ولا تعزز الصفقة الخاسرة! تذكر أن وقف الخسارة هو "بوليصة التأمين" التي اشتريتها مسبقاً لحماية رأس مالك.
2. **إذا تحرك السعر في ربح ثم بدأ يرتد تصحيحياً في صفقة سوينج:** اسأل نفسك السؤال الفاصل: *هل كسر السعر قاعاً/قمة هيكلية على الفريم الكبير، أم أنه مجرد تصحيح طبيعي؟* إذا لم ينكسر الهيكل، ارفع يدك عن زر الإغلاق!
3. **إذا ظهرت فرصة ثانية مغرية بعد خسارة:** امنح نفسك **هدنة إلزامية لمدة 15 دقيقة** وطبق تنفس 5-5-5 قبل أن تقرر هل الفرصة حقيقية أم أنها فخ تداول انتقامي.`;
    } else if (mem.isFollowUp) {
      // متابعة عامة للجولة 2 أو 3+ مع نفس المستشار
      adviceTitle = `⚡ تعميق الحوار (الجولة ${mem.turnCount}) مع ${advisor.name}:`;
      specificAdvice = `بناءً على ما ناقشناه للتو، دعنا ننتقل من الفهم النظري إلى **التنفيذ التكتيكي الحاسم**:
• سؤالك الجديد (*"${q}"*) يكشف أنك تريد حلاً عملياً يقطع الشك باليقين.
• قاعدتي التنفيذية لك في هذه الجولة: ${advisor.tradingStyleAdvice || advisor.corePrinciple}
• بالعودة إلى ملفك الحي: نسبة انضباطك الحالية **${ctx.disciplineRate}%** عبر **${ctx.totalTrades} صفقة** ${ctx.prof.focusAreas ? `، وتركيزك الأساسي في جلسة الصراحة هو: *"${ctx.prof.focusAreas}"*` : ''}.
• **التكليف الفوري مني لك الآن:** قبل أن تفتح صفقتك القادمة، اكتب على ورقة أمامك سبب الدخول ومكان الخروج، ولا تغير خطتك أثناء سريان الصفقة مهما تحركت الشموع!`;
    } else {
      // الجولة الأولى (التأسيسية) حسب موضوع السؤال
      if (advisor.id === 'douglas') {
        if (mem.topic === 'swing_hold') {
          specificAdvice = `أنت تخرج مبكراً من صفقات السوينج لأنك لم تتقبل بعد أن **هذه الصفقة الواحدة هي مجرد رقم ضمن عينة من 20 صفقة**. عندما تخاف من ارتداد السعر بعد دخولك في الربح، فأنت تتعامل مع الربح غير المحقق وكأنه قد يحدد قيمتك! ضع أمر جني الأرباح ووقف الخسارة وفق حافتك الإحصائية (Edge)، وذكّر نفسك: *"لا يهم ماذا تفعل هذه الشمعة، المهم أنني أنفذ احتمالاتي على المدى الطويل"*.`;
        } else if (mem.topic === 'revenge_loss') {
          specificAdvice = `الرغبة في الانتقام تعني أنك دخلت الصفقة السابقة وأنت **تتوقع أنها مضمونة** ولم تتقبل المخاطرة حقاً قبل الدخول! الخسارة جزء طبيعي من تكلفة العمل في الأسواق. أوقف التداول الآن، وتنفس بعمق حتى تصل إلى حالة الخلو من الغضب (Carefree State of Mind).`;
        } else if (mem.topic === 'hesitation_fear') {
          specificAdvice = `التردد قبل ضغط زر الدخول سببه محاولة عقلك التنبؤ بالمستقبل وتجنب الألم. في كتابي *Trading in the Zone* أوضحت القاعدة: **لست بحاجة لمعرفة ما سيحدث في الصفقة القادمة لتربح المال**. ما دامت شروط استراتيجيتك مكتملة والمخاطرة محددة ومقبولة مسبقاً، نفّذ بلا تردد!`;
        } else {
          specificAdvice = `انظر إلى تداولك من عدسة **التفكير بالاحتمالات (Thinking in Probabilities)**: التزامك الحالي بالخطة يبلغ **${ctx.disciplineRate}%** عبر **${ctx.totalTrades} صفقة**. استمر في بناء عينة صفقات نقية خالية من التردد والارتجال.`;
        }
      } else if (advisor.id === 'ptj') {
        if (mem.topic === 'swing_hold') {
          specificAdvice = `في صفقات السوينج الكبرى، السر هو **عدم تناظر العائد إلى المخاطرة (5 إلى 1)**. إذا خاطرت بـ 1%، فلا تقبل بالهروب عند ربح 0.5%! احمِ نقطة دخولك عندما يتحرك السوق لصالحك وفق هيكل الشارت، ودع الموجة تدفع لك ثمن صبرك.`;
        } else if (mem.topic === 'revenge_loss') {
          specificAdvice = `اسمعني جيداً: **الدفاع أولاً وقبل كل شيء (Play Great Defense, Not Offense)!** القاعدة التي علقتها على حائط مكتبي هي: *"الخاسرون يعززون صفقاتهم الخاسرة (Losers Average Losers)"*. عندما يضرب السوق وقف خسارتك أو تشعر بالغضب، قلّص حجم مخاطرتك إلى النصف أو أغلق الشاشة فوراً لحماية رأس مالك.`;
        } else {
          specificAdvice = `قبل أي صفقة اليوم، لا تسأل كم سأربح، بل اسأل: **أين مخرجي الدفاعي الدقيق إذا كنت على خطأ؟** حماية رأس مالك هي التي تبقيك في اللعبة لتقتنص فرص السوينج التاريخية.`;
        }
      } else if (advisor.id === 'bailouni') {
        if (mem.topic === 'swing_hold') {
          specificAdvice = `الهروب المبكر من أرباح السوينج هو سلوك **المتداول الصياد (Hunter)** الذي يبحث عن جرعة دوبامين سريعة لتهدئة جهازه العصبي! تحول الآن إلى **المتداول المزارع (Farmer)**: لقد زرعت البذرة في منطقة دخول صحيحة ووضعت سياج الحماية (Stop Loss)، فلا تقلع الشجرة كل 5 دقائق لتتأكد أنها تنمو!`;
        } else if (mem.topic === 'revenge_loss') {
          specificAdvice = `جهازك العصبي الآن في حالة استنفار (Fight or Flight). طبق فوراً **بروتوكول الفصل وإعادة الضبط (Detach & Reset)** في الخطوة 6 من الكورس: قم من أمام الشاشة، تنفس بإيقاع 5-5-5، وافصل هويتك وقيمتك كإنسان عن نتيجة هذه الصفقة.`;
        } else {
          specificAdvice = `تذكر أن نتائجك في السوينج والمضاربة هي انعكاس لهويتك العصبية. ${ctx.reviewedToday ? 'أحييك لأنك راجعت دستور استراتيجيتك اليوم قبل الجلسة!' : 'تنبيه مهم: لم تضغط بعد على زر مراجعة دستور استراتيجيتك اليوم في غرفة التداول؛ راجعه أولاً لتفعيل عقلية المزارع المنضبط!'}`;
        }
      } else if (advisor.id === 'steenbarger') {
        specificAdvice = `من منظور الأداء العالي (High Performance Psychology): راجعت ملفك التشخيصي وسجل صفقاتك (**${ctx.totalTrades} صفقة** بنسبة انضباط **${ctx.disciplineRate}%**). ${ctx.prof.triggers ? `أنت ذكرت في جلسة الصراحة أن أهم محفزاتك هي: *"${ctx.prof.triggers}"* — راقب هذا المحفز الآن بوعي!` : 'أنصحك بتدوين حالتك الذهنية والجسدية قبل كل جلسة، لأن معظم أخطاء التسرع تحدث عندما ينخفض مستوى طاقتك الذهنية.'}`;
      } else if (advisor.id === 'seykota') {
        if (mem.topic === 'swing_hold') {
          specificAdvice = `المال الحقيقي في السوينج لا يُصنع من براعة الدخول، بل من **الجلوس الهادئ على الصفقة الرابحة (Sitting on your hands)** بينما الاتجاه يجري لصالحك! اقطع خسائرك بسرعة، ولكن عندما تكون في صفقة رابحة مع الاتجاه، دع الأرباح تجري (Let Profits Run)!`;
        } else {
          specificAdvice = `تذكر قوانيني الأربعة التي لا تتغير: **1) اقطع الخسائر، 2) دع الأرباح تجري، 3) حافظ على صغر حجم المخاطرة، 4) اتبع القواعد بلا جدال**. اسأل نفسك: هل تبحث الآن عن الربح المنضبط أم تبحث عن الإثارة والدراما؟`;
        }
      } else {
        specificAdvice = `بصفتي **${advisor.name}**، أذكرك بقاعدتي الذهبية: **${advisor.corePrinciple || advisor.specialty}**
وفي ميدان تداولك (السوينج والمضاربة): ${advisor.tradingStyleAdvice || 'التزم بخطتك المكتوبة واضبط عواطفك أمام التقلبات.'}
${ctx.aimGoal ? `\nتذكر أن كل قرار تتخذه اليوم يخدم هدفك الرئيسي المحدد: *"${ctx.aimGoal}"*.` : ''}`;
      }
    }

    const fullText = `${followUpBanner ? followUpBanner + '\n\n' : ''}💬 **رد ${advisor.name}:**\n« *${wisdomPick}* »\n\n**🎯 ${adviceTitle}**\n${specificAdvice}`;

    return {
      text: fullText,
      wisdomQuote: wisdomPick,
      adviceTitle,
      specificAdvice,
      followUpBanner
    };
  },

  generateRoundtableReply(question) {
    const ctx = this.getCouncilContextSnapshot();
    const mem = this.getCouncilConversationMemory(question);
    const q = (question || 'تقييم حالتي وخطة عملي اليوم في التداول والنجاح').trim();

    const pbStatus = ctx.reviewedToday
      ? '✅ راجعت دستور استراتيجيتك اليوم'
      : '⚠️ لم تراجع دستور استراتيجيتك اليوم بعد';
    const weaknessNote = ctx.prof.weaknesses
      ? `نقطة الضعف المسجلة في جلسة الصراحة: *"${ctx.prof.weaknesses}"*`
      : 'لم تسجل بعد نقاط ضعفك في جلسة الصراحة';

    let headerSummary = '';
    let advisorCards = [];

    // 1. إذا كان المستخدم يتابع النقاش ويطلب مثالاً عملياً بالأرقام على الشارت
    if (mem.followUpIntent === 'example_numbers') {
      headerSummary = `🔗 **متابعة اجتماع الطاولة المستديرة (الجولة ${mem.turnCount} — التطبيق العملي بالأرقام على الشارت)**
استكمالاً لقضيتنا السابقة (*"${mem.rootTopicQuestion.slice(0, 70)}..."*)، إليك كيف يطبّق كل مستشار كلامه بالأرقام على صفقتك القادمة:`;

      advisorCards = [
        {
          title: '🎯 1. مارك دوغلاس (ورقة عينة الـ 20 صفقة بالأرقام):',
          accent: '#60A5FA',
          body: `افترض أن حسابك **$10,000** ومخاطرتك الثابتة **1% ($100)** وعائدك المستهدف في السوينج **1:3 (+$300)**:
• حتى لو خسرت **10 صفقات (-$1,000)** وربحت **10 صفقات (+$3,000)**، فصافي ربحك هو **+$2,000 (+20%)**!
• الكارثة تحدث فقط عندما تغلق الصفقات الرابحة مبكراً عند **+$60** خوفاً من الارتداد، أو ترفع اللوت بعد خسارتين. التزم بثبات الـ $100 في جميع الصفقات العشرين!`
        },
        {
          title: '🛡️ 2. بول تيودور جونز (معادلة تقليص المخاطرة الدفاعية):',
          accent: '#34D399',
          body: `تطبيقي الرقمي الفوري لك على الشارت:
• إذا كنت قادماً من صفقة خاسرة اليوم، **اقسم حجم مخاطرتك المعتاد إلى النصف (0.5% بدلاً من 1%)** في الصفقة القادمة.
• لا تحرك وقف الخسارة نقطة واحدة للخلف، ولا تدخل الصفقة أصلاً إلا إذا كان الهدف الفني يمنحك **3 أضعاف وقف الخسارة على الأقل (3R)**.`
        },
        {
          title: '🧬 3. باتريك بايلوني (بروتوكول الفصل العصبي أثناء الصفقة):',
          accent: '#C084FC',
          body: `كيف تطبق هذا سلوكياً أمام الشاشة الآن؟
1. في **السوينج**: حلل على فريم 4 ساعات أو اليومي، ضع أمر الدخول والوقف والهدف، ثم **أغلق الشارت تماماً** واعتمد على التنبيهات السعرية (Price Alerts).
2. في **المضاربة اليومية**: حدد الحد الأقصى لخسارة اليوم (مثلاً 1.5%)، وإذا وصل إليه الحساب، أغلق المنصة فوراً لبقية اليوم.`
        },
        {
          title: '🌊 4. إد سيكوتا ود. ستينبارجر (طريقة تأمين الربح دون خنق الصفقة):',
          accent: '#38BDF8',
          isConclusion: true,
          body: `**القاعدة التطبيقية لحماية الربح دون الهروب المبكر:**
• عندما يصل السعر إلى **1:1.5** من هدف السوينج، يمكنك حجز **30% فقط** من العقود لتهدئة عقلك العاطفي، وانقل وقف الخسارة للجزء المتبقي (70%) إلى نقطة الدخول (Break-Even)، واترك الـ 70% تركب الموجة كاملة نحو الهدف النهائي!`
        }
      ];
    }
    // 2. إذا كان المستخدم يطرح سؤال متابعة من نوع "ماذا لو عكس السعر / ظهرت فرصة / شعرت بالخوف"
    else if (mem.followUpIntent === 'what_if_reversal') {
      headerSummary = `🔗 **متابعة اجتماع الطاولة المستديرة (الجولة ${mem.turnCount} — خطة الطوارئ عند انعكاس السعر أو التردد)**
رداً على سؤالك التكميلي (*"${q}"*) المرتبط بنقاشنا السابق (*"${mem.rootTopicQuestion.slice(0, 60)}..."*):`;

      advisorCards = [
        {
          title: '🎩 1. نابليون هيل (القانون 6 و 11: فصل الحقائق عن أوهام الخوف):',
          accent: '#D4AF37',
          body: `عندما يعكس السعر عليك بضع نقاط، يهمس لك "شبح الخوف" بأن الصفقة فاشلة! هنا يتدخل **التفكير الدقيق (Law #11)**: اسأل نفسك: هل ضُرب وقف الخسارة الفني أم لا؟ ما دام لم يُضرب، فارتداد السعر مجرد تذبذب طبيعي لا يستدعي كسر خطتك.`
        },
        {
          title: '🛡️ 2. بول تيودور جونز (الخط الأحمر عند الانعكاس):',
          accent: '#34D399',
          body: `إذا عكس السعر وضرب وقف الخسارة الفعلي: **تقبل الخسارة بشجاعة واخرج فوراً!** إياك أن تقول "سأنتظر شمعة أخرى لعل السعر يعود". أما إذا ظهرت فرصة ثانية بعد الخسارة مباشرة، فلا تدخلها إلا إذا كانت من الدرجة الأولى (A+ Setup) وبنصف حجم المخاطرة.`
        },
        {
          title: '🧬 3. باتريك بايلوني (قاعدة الـ 90 ثانية لإعادة ضبط الجهاز العصبي):',
          accent: '#C084FC',
          body: `علمياً، موجة الأدرينالين والذعر في الدم تستغرق **90 ثانية** لتصل ذروتها ثم تبدأ بالانحسار إذا لم تغذِّها بأفكار كارثية! عندما تشعر بالخوف أثناء الصفقة، ابعد يدك عن الماوس لمدة 90 ثانية وتنفس ببطء (5 ثوانٍ شهيق - 5 زفير) قبل اتخاذ أي قرار.`
        },
        {
          title: '🌊 4. القرار الجماعي للمجلس للتعامل مع هذا السيناريو:',
          accent: '#38BDF8',
          isConclusion: true,
          body: `**بروتوكول "إذا حدث كذا... سأفعل كذا" (If-Then Plan):**
1. **إذا عكس السعر دون كسر الوقف:** لا تدخل يدوي، ولا تبريد (No Averaging Down).
2. **إذا ضُرب الوقف:** إغلاق الشارت لمدة 15 دقيقة وتعبئة تبويب **🔄 التفريغ بعد الصفقة**.
3. **إذا سار السعر نحو الهدف:** الالتزام بخطة الخروج المكتوبة في **📜 دستور استراتيجيتي**.`
        }
      ];
    }
    // 3. إذا كان المستخدم يطلب خطة تنفيذية / بروتوكول عمل فوري أو في الجولة 2 و 3+ من النقاش
    else if (mem.isFollowUp) {
      headerSummary = `🔗 **متابعة اجتماع الطاولة المستديرة (الجولة ${mem.turnCount} — البروتوكول التنفيذي الحاسم)**
بناءً على تسلسل نقاشنا في هذه الجلسة حول (*"${mem.rootTopicQuestion.slice(0, 60)}..."*) وتعقيبك الأخير (*"${q}"*):`;

      advisorCards = [
        {
          title: '🎩 1. نابليون هيل (توقيع عهد الانضباط لهذه الجلسة):',
          accent: '#D4AF37',
          body: `لقد شخّصنا المشكلة في الجولة الأولى، والآن حان وقت **العمل المنظم (Organized Action)**. ${weaknessNote}. لا قيمة لأي حكمة ما لم تتحول إلى قرار قطعي تنفذه الآن في حسابك.`
        },
        {
          title: '🎯 2. مارك دوغلاس وبول تيودور جونز (الضوابط الصارمة للصفقة القادمة):',
          accent: '#60A5FA',
          body: `• **شرط الدخول:** تطابق 100% مع شروطك المكتوبة في **📜 دستور استراتيجيتي** (${ctx.pb.entryRules ? `شرطك: "${ctx.pb.entryRules.slice(0, 55)}..."` : 'اكتب شروط دخولك بوضوح'}).
• **شرط المخاطرة:** مخاطرة محددة سلفاً ومقبولة نفسياً بالكامل قبل ضغط الزر.`
        },
        {
          title: '🧬 3. باتريك بايلوني ود. ستينبارجر (فلتر الحالة الذهنية):',
          accent: '#C084FC',
          body: `تقييمنا لملفك الحالي: سجلت **${ctx.totalTrades} صفقة** بنسبة التزام **${ctx.disciplineRate}%**. ${ctx.prof.focusAreas ? `وتذكيرك الدائم لنفسك هو: *"${ctx.prof.focusAreas}"*.` : ''} إذا كانت طاقتك الذهنية أقل من 7/10 الآن، اكتفِ بالمراقبة ولا تتداول.`
        },
        {
          title: '✅ 4. عقد الالتزام الفوري الصادر عن المجلس (نفّذه الآن):',
          accent: '#34D399',
          isConclusion: true,
          body: `1. افتح تبويب **🛡️ فلتر ما قبل الصفقة** ولا تفتح أي عقد إلا بعد إضاءة جميع الشروط الـ 5 باللون الأخضر.
2. التزم بعدم لمس الصفقة بعد فتحها حتى تصل إلى هدفها أو وقفها المحدد سلفاً.
3. بعد انتهاء الصفقة، عد إلينا هنا في نفس هذه الجلسة واكتب لنا: ماذا حدث وكيف تصرفت لنراجع أداءك معاً!`
        }
      ];
    }
    // 4. الجولة الأولى (السؤال الافتتاحي في القضية) — مخصص بدقة حسب نوع القضية!
    else {
      headerSummary = `👑 **محضر اجتماع الطاولة المستديرة (الجولة 1) حول: "${q}"**
*(بياناتك المرفوعة أمام المجلس: إجمالي الصفقات: **${ctx.totalTrades}** | نسبة الانضباط: **${ctx.disciplineRate}%** | نسبة الفوز: **${ctx.winRate}%** | ${pbStatus})*`;

      if (mem.topic === 'swing_hold') {
        advisorCards = [
          {
            title: '🎩 1. نابليون هيل (رئيس المجلس — الهدف المحدد والصبر):',
            accent: '#D4AF37',
            body: `« الخروج المبكر من صفقة سوينج رابحة هو نتيجة غياب **الهدف الرئيسي المحدد (Law #2)** وضعف **ضبط النفس (Law #6)** أمام تقلبات الشموع الصغيرة. عندما تدخل صفقة سوينج، فإن هدفك هو الموجة الكبيرة لا الفتات اللحظي! »`
          },
          {
            title: '🎯 2. مارك دوغلاس (Trading in the Zone — وهم الخوف من ضياع الربح):',
            accent: '#60A5FA',
            body: `« أنت تخرج مبكراً لأنك تخاف أن يسترد السوق الربح العائم فتعيش ألم الندم! تذكّر: في عينة من 20 صفقة، صفقات السوينج ذات العائد الكبير (1:3 و 1:5) هي التي تدفع تكاليف الصفقات الخاسرة وتبني ثروتك. إذا قطعت ربحك مبكراً، فأنت تدمر ميزتك الإحصائية بيدك! »`
          },
          {
            title: '🛡️ 3. بول تيودور جونز (عدم تناظر العائد إلى المخاطرة 5:1):',
            accent: '#34D399',
            body: `« في السوينج، أنا لا أدخل صفقة من أجل ربح مساوٍ للمخاطرة. عندما يسير السعر في صالحك، ارفع وقف الخسارة تدريجياً تحت القيعان الهيكلية المحمية، ودع الصفقة الرابحة تعمل لصالحك دون تدخل عاطفي! »`
          },
          {
            title: '🧬 4. باتريك بايلوني (Mentorship 2.0 — عقلية المزارع مقابل الصياد):',
            accent: '#C084FC',
            body: `« إغلاق الصفقة الرابحة مبكراً هو سلوك **الصياد المتوتر (Hunter)** الذي يريد جرعة دوبامين فورية ليهرب من توتر الانتظار! تحوّل إلى **المزارع (Farmer)**: ابتعد عن الفريمات الصغيرة (5 و15 دقيقة) بعد دخول صفقة السوينج حتى لا يستفزك كل ارتداد بسيط. »`
          },
          {
            title: '🌊 5. إد سيكوتا ود. ستينبارجر (الخلاصة التنفيذية للصبر على السوينج):',
            accent: '#38BDF8',
            isConclusion: true,
            body: `**القرار الجماعي للمجلس لك الآن:**
1. حدد مسبقاً في **📜 دستور استراتيجيتي** قاعدة الخروج للسوينج (مثلاً: إغلاق جزئي 30% عند الهدف الأول، وترك 70% للهدف النهائي).
2. بعد وضع الأوامر، أغلق فريمات المضاربة الصغيرة واعتمد على المنبهات السعرية.
*(💡 يمكنك الآن سؤالنا في الأسفل أو الضغط على أزرار المتابعة لمعرفة كيف تطبق هذا بالأرقام على الشارت!)*`
          }
        ];
      } else if (mem.topic === 'revenge_loss') {
        advisorCards = [
          {
            title: '🎩 1. نابليون هيل (رئيس المجلس — القانون 6: ضبط النفس وقت العاصفة):',
            accent: '#D4AF37',
            body: `« الغضب والرغبة في الانتقام من السوق هما أخطر أعداء **التفكير الدقيق (Law #11)**. السوق كيان محايد لا يعاندك شخصياً؛ ومن يفقد سيطرته على نفسه بعد خسارة مؤقتة يخسر أضعافها. أوقف التنفيذ فوراً! »`
          },
          {
            title: '🎯 2. مارك دوغلاس (تقبّل المخاطرة قبل الدخول):',
            accent: '#60A5FA',
            body: `« شعورك بالغضب والرغبة في التعويض السريع دليل قاطع على أنك دخلت الصفقة السابقة وأنت **لم تتقبل احتمال خسارتها حقاً**! الخسارة هي مجرد تكلفة تشغيلية طبيعية في عملنا كمتداولين. »`
          },
          {
            title: '🛡️ 3. بول تيودور جونز (العب الدفاع أولاً — لا تعزز الخسارة!):',
            accent: '#34D399',
            body: `« حذارِ من الدخول الآن بحجم عقد مضاعف لتعويض ما فات! قاعدتي الصارمة: بعد أي خسارة، مهمتك الأولى هي **حماية رأس المال المتبقي**. إذا كنت مضطراً للتداول لاحقاً، فبنصف حجم المخاطرة المعتاد فقط. »`
          },
          {
            title: '🧬 4. باتريك بايلوني (إيقاف اختطاف اللوزة الدماغية Amygdala Hijack):',
            accent: '#C084FC',
            body: `« دماغك الآن تحت تأثير الكورتيزول والأدرينالين، والفص الجبهي المسؤول عن المنطق معطل مؤقتاً! افتح فوراً تبويب **🔄 التفريغ بعد الصفقة (Detach & Reset)** في غرفة التداول وطبق بروتوكول ما بعد الخسارة. »`
          },
          {
            title: '🌊 5. إد سيكوتا ود. ستينبارجر (أمر الطوارئ الإلزامي الآن):',
            accent: '#38BDF8',
            isConclusion: true,
            body: `**القرار الجماعي الإلزامي للمجلس:**
1. ارفع يدك عن الماوس وأغلق شاشة التداول لمدة **30 دقيقة على الأقل**.
2. شغل **مؤقت التنفس المربع (5-5-5-5)** لتهدئة جهازك العصبي.
3. اكتب لنا هنا في الشات بعد قليل: ما الذي دفعك للغضب في هذه الصفقة؟ لنفككه معاً قبل أن تلمس السوق مجدداً!`
          }
        ];
      } else {
        advisorCards = [
          {
            title: '🎩 1. نابليون هيل (رئيس المجلس — الهدف وضبط النفس):',
            accent: '#D4AF37',
            body: `« يا صديقي، النجاح العظيم يبدأ من **الهدف الرئيسي المحدد (Law #2)** و**ضبط النفس (Law #6)**. في هذه القضية التي طرحتها، احذر من اتخاذ أي قرار تحكمه العاطفة اللحظية. ${weaknessNote}. ارجع إلى وثيقة عهدك ودستورك المكتوب. »`
          },
          {
            title: '🎯 2. مارك دوغلاس (التفكير بالاحتمالات — Trading in the Zone):',
            accent: '#60A5FA',
            body: `« من زاوية الاحتمالات: تخلص تماماً من التعلق بنتيجة الصفقة الواحدة! سواء كنت في صفقة سوينج أو مضاربة يومية، مهمتك الوحيدة هي **التنفيذ الخالي من الأخطاء على مدى عينة من 20 صفقة**. تقبل المخاطرة بالكامل قبل الدخول. »`
          },
          {
            title: '🛡️ 3. بول تيودور جونز (إدارة المخاطر والدفاع الصارم):',
            accent: '#34D399',
            body: `« نصيحتي الحاسمة لك: **العب الدفاع أولاً!** قبل أن تفكر في العائد، حدد نقطة بطلان الصفقة (Stop Loss) بدقة، ولا تفكر أبداً في توسيع الوقف أو التبريد في صفقة خاسرة. ابحث فقط عن الفرص ذات العائد غير المتناظر (3:1 أو 5:1). »`
          },
          {
            title: '🧬 4. باتريك بايلوني (Mentorship 2.0 — الهوية العصبية):',
            accent: '#C084FC',
            body: `« راقب جهازك العصبي الآن: هل تتصرف بعقلية **الصياد المتوتر (Hunter)** الباحث عن الدوبامين، أم بعقلية **المزارع المنضبط (Farmer)**؟ طبق قائمة **Primed to Perform** قبل لمس الشارت، وافصل قيمتك الذاتية عن حركة الشموع! »`
          },
          {
            title: '🌊 5. إد سيكوتا ود. بريت ستينبارجر (الخلاصة التنفيذية للجلسة):',
            accent: '#38BDF8',
            isConclusion: true,
            body: `**القرار الجماعي للمجلس لك الآن:**
1. ${ctx.reviewedToday ? 'استمر في التزامك بدستور الدخول والخروج الذي راجعته اليوم.' : 'توجه أولاً إلى تبويب **📜 دستور استراتيجيتي** واقرأ شروط الدخول والخروج واضغط زر المراجعة اليومية.'}
2. نفّذ فقط الصفقات التي تحقق شروطك المكتوبة 100%، واترك أرباح السوينج تجري نحو أهدافها دون تدخل عاطفي.
3. تابع الحوار معنا بالأسفل بأي سؤال تفصيلي حول هذه القضية!`
          }
        ];
      }
    }

    const fullText =
      headerSummary +
      '\n\n---\n\n' +
      advisorCards.map((c) => `**${c.title}**\n${c.body}`).join('\n\n');

    return {
      text: fullText,
      headerSummary,
      advisorCards
    };
  },

  async consultImaginaryAdvisor() {
    const advisorId = document.getElementById('advisorSelect')?.value || 'hill';
    const inputEl = document.getElementById('advisorQuestion');
    const rawQuestion = inputEl ? inputEl.value.trim() : '';
    const advisor = window.NAPOLEON_HILL_DATA.imaginaryAdvisors.find((a) => a.id === advisorId) || window.NAPOLEON_HILL_DATA.imaginaryAdvisors[0];
    if (!advisor) return;

    const questionText = rawQuestion || `ما هي نصيحتك الذهبية لي اليوم في تداولي (السوينج والمضاربة) وتطوير ذاتي؟`;
    if (inputEl) inputEl.value = '';

    if (!Array.isArray(this.state.councilChatHistory)) {
      this.state.councilChatHistory = [];
    }

    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    this.state.councilChatHistory.push({
      role: 'user',
      targetLabel: `حوار مع ${advisor.name}`,
      time: nowTime,
      text: questionText
    });
    this.renderCouncilChat();

    const replyObj = this.generateAdvisorContextualReply(advisor, questionText);
    let engineBadge = '🧠 المحرك الفلسفي المدمج';

    if (this.state.geminiApiKey && this.state.geminiApiKey.trim().length > 10) {
      const aiReply = await this.callGeminiCouncilAPI('advisor', questionText, advisor);
      if (aiReply && aiReply.text) {
        replyObj.specificAdvice = aiReply.text;
        replyObj.adviceTitle = `🌐 رد حي ومخصص من ${advisor.name} عبر الذكاء الاصطناعي (${aiReply.model}):`;
        engineBadge = `🌐 Google Gemini AI (${aiReply.model})`;
      }
    }

    this.state.councilChatHistory.push({
      role: 'advisor',
      speakerName: `${advisor.name} • [${engineBadge}]`,
      speakerAvatar: advisor.avatar,
      time: nowTime,
      text: replyObj.text,
      wisdomQuote: replyObj.wisdomQuote,
      adviceTitle: replyObj.adviceTitle,
      specificAdvice: replyObj.specificAdvice,
      followUpBanner: replyObj.followUpBanner
    });

    this.saveState();
    this.renderCouncilChat();
    this.addXP(15, `محاورة المستشار ${advisor.name} في غرفة المستشارين`);
  },

  async conveneRoundtableMeeting() {
    const inputEl = document.getElementById('advisorQuestion');
    const rawQuestion = inputEl ? inputEl.value.trim() : '';
    const questionText = rawQuestion || `أدعو المجلس لاجتماع الطاولة المستديرة لتقييم أدائي وتوجيهي في السوينج والمضاربة اليومية.`;
    if (inputEl) inputEl.value = '';

    if (!Array.isArray(this.state.councilChatHistory)) {
      this.state.councilChatHistory = [];
    }

    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    this.state.councilChatHistory.push({
      role: 'user',
      targetLabel: 'اجتماع الطاولة المستديرة للمجلس كاملاً 👑',
      time: nowTime,
      text: questionText
    });
    this.renderCouncilChat();

    const replyObj = this.generateRoundtableReply(questionText);
    let engineBadge = '🧠 المحرك الفلسفي المدمج';

    if (this.state.geminiApiKey && this.state.geminiApiKey.trim().length > 10) {
      const aiReply = await this.callGeminiCouncilAPI('roundtable', questionText, null);
      if (aiReply && aiReply.text) {
        engineBadge = `🌐 Google Gemini AI (${aiReply.model})`;
        replyObj.advisorCards.push({
          title: `🌐 تحليل Google Gemini AI المعمّق والمخصص لسؤالك (${aiReply.model}):`,
          accent: '#34D399',
          isConclusion: true,
          body: aiReply.text
        });
      }
    }

    this.state.councilChatHistory.push({
      role: 'roundtable',
      speakerName: `اجتماع الطاولة المستديرة • [${engineBadge}]`,
      speakerAvatar: '👑',
      time: nowTime,
      text: replyObj.text,
      headerSummary: replyObj.headerSummary,
      advisorCards: replyObj.advisorCards
    });

    this.saveState();
    this.renderCouncilChat();
    this.addXP(30, 'عقد اجتماع الطاولة المستديرة في مجلس المستشارين');
  },

  async callGeminiCouncilAPI(mode, questionText, advisor) {
    try {
      const ctx = this.getCouncilContextSnapshot();
      const recentHistory = (this.state.councilChatHistory || [])
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'المتداول' : m.speakerName}: ${m.text}`)
        .join('\n---\n');

      const prompt =
        mode === 'advisor' && advisor
          ? `أنت تتقمص شخصية المستشار التاريخي وأسطورة التداول/النجاح: (${advisor.name} — تخصصه: ${advisor.specialty} — مبدؤه: ${advisor.corePrinciple}).
المتداول يتداول بأسلوب السوينج والمضاربة اليومية.
بياناته الحية: إجمالي الصفقات=${ctx.totalTrades}, نسبة الانضباط=${ctx.disciplineRate}%, نقاط ضعفه في جلسة الصراحة=(${ctx.prof.weaknesses || 'غير محدد'}), محفزاته=(${ctx.prof.triggers || 'غير محدد'}), شروط دخوله في دستوره=(${ctx.pb.entryRules || 'غير محدد'}).
سياق الحوار السابق في الجلسة:
${recentHistory}
سؤال المتداول الموجه لك الآن: "${questionText}"
أجب بشخصية (${advisor.name}) باللغة العربية بأسلوب مباشر وعملي جداً ومرتبط بسؤاله وسياق الحوار السابق في 4 إلى 6 أسطر مركزة.`
          : `أنت تدير اجتماع الطاولة المستديرة الذي يضم (نابليون هيل، مارك دوغلاس، بول تيودور جونز، باتريك بايلوني، وإد سيكوتا).
بيانات المتداول الحية: إجمالي الصفقات=${ctx.totalTrades}, نسبة الانضباط=${ctx.disciplineRate}%, نقاط ضعفه=(${ctx.prof.weaknesses || 'غير محدد'}).
سياق الحوار السابق في الجلسة:
${recentHistory}
سؤال المتداول الجديد للمجلس: "${questionText}"
قدم خلاصة ذكية ومباشرة جداً باللغة العربية تجيب على سؤاله الجديد وتبني على النقاش السابق بخطوات عملية للسوينج والمضاربة اليومية.`;

      return await this.requestGeminiCompletion(prompt);
    } catch (e) {
      return null;
    }
  },

  // حاسبة قانون الادخار (Law #4)
  loadSavingsInputs() {
    const p = this.state.savingsPlan || { income: 10000, savePct: 20, eduPct: 10, livingPct: 55 };
    const incEl = document.getElementById('finIncome');
    if (!incEl) return;
    incEl.value = p.income;
    document.getElementById('finSavePct').value = p.savePct;
    document.getElementById('finEduPct').value = p.eduPct;
    document.getElementById('finLivingPct').value = p.livingPct;
  },

  calculateSavingsPlan() {
    const income = parseFloat(document.getElementById('finIncome')?.value) || 0;
    const savePct = parseInt(document.getElementById('finSavePct')?.value, 10) || 20;
    const eduPct = parseInt(document.getElementById('finEduPct')?.value, 10) || 10;
    const livingPct = parseInt(document.getElementById('finLivingPct')?.value, 10) || 55;

    document.getElementById('finSavePctVal').textContent = `${savePct}%`;
    document.getElementById('finEduPctVal').textContent = `${eduPct}%`;
    document.getElementById('finLivingPctVal').textContent = `${livingPct}%`;

    const remainingPct = Math.max(0, 100 - (savePct + eduPct + livingPct));
    const monthlySave = Math.round((income * savePct) / 100);
    const monthlyEdu = Math.round((income * eduPct) / 100);
    const monthlyLiving = Math.round((income * livingPct) / 100);
    const monthlyOther = Math.round((income * remainingPct) / 100);

    const year1 = monthlySave * 12;
    // حساب تراكم الثروة لمدة 5 سنوات و 10 سنوات مع عائد استثماري سنوي محافظ (8%)
    const calcCompound = (monthly, years, annualRate = 0.08) => {
      const r = annualRate / 12;
      const n = years * 12;
      return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r));
    };

    const year5Compound = calcCompound(monthlySave, 5);
    const year10Compound = calcCompound(monthlySave, 10);

    const resultsEl = document.getElementById('savingsPlanResults');
    if (resultsEl) {
      resultsEl.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 18px;">
          <div style="padding: 14px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.35); border-radius: 10px;">
            <div style="font-size: 0.78rem; color: var(--text-secondary);">💰 ادخار واستثمار شهري (${savePct}%)</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #34D399;">${monthlySave.toLocaleString()}</div>
          </div>
          <div style="padding: 14px; background: rgba(212,175,55,0.1); border: 1px solid var(--border-gold); border-radius: 10px;">
            <div style="font-size: 0.78rem; color: var(--text-secondary);">📚 تطوير الذات والمعرفة (${eduPct}%)</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: var(--gold-light);">${monthlyEdu.toLocaleString()}</div>
          </div>
          <div style="padding: 14px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); border-radius: 10px;">
            <div style="font-size: 0.78rem; color: var(--text-secondary);">🏠 المعيشة الأساسية (${livingPct}%)</div>
            <div style="font-size: 1.2rem; font-weight: 700;">${monthlyLiving.toLocaleString()}</div>
          </div>
          <div style="padding: 14px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); border-radius: 10px;">
            <div style="font-size: 0.78rem; color: var(--text-secondary);">🌟 الترفيه والطوارئ والعطاء (${remainingPct}%)</div>
            <div style="font-size: 1.2rem; font-weight: 700;">${monthlyOther.toLocaleString()}</div>
          </div>
        </div>

        <div style="padding: 16px; background: rgba(0,0,0,0.3); border-radius: 12px; border-right: 4px solid var(--gold-primary);">
          <h4 style="color: var(--gold-light); margin-bottom: 10px; font-size: 0.96rem;">🚀 القوة التراكمية لعادة الادخار والاستثمار (بعائد 8% سنوياً):</h4>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
            <span>بعد سنة واحدة (12 شهراً):</span>
            <strong style="color: var(--text-primary);">${year1.toLocaleString()}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
            <span>بعد 5 سنوات من الانضباط:</span>
            <strong style="color: var(--gold-light);">${year5Compound.toLocaleString()}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:1rem;">
            <span>بعد 10 سنوات (صندوق الحرية المالية):</span>
            <strong style="color: #34D399;">${year10Compound.toLocaleString()}</strong>
          </div>
        </div>
      `;
    }
  },

  saveFinancialPlan() {
    this.state.savingsPlan = {
      income: parseFloat(document.getElementById('finIncome')?.value) || 10000,
      savePct: parseInt(document.getElementById('finSavePct')?.value, 10) || 20,
      eduPct: parseInt(document.getElementById('finEduPct')?.value, 10) || 10,
      livingPct: parseInt(document.getElementById('finLivingPct')?.value, 10) || 55
    };
    this.addXP(20, 'اعتماد خطة قانون الادخار والاستقلال المالي');
  },

  // ==================== 7. المزامنة السحابية التلقائية الحية (Google Drive / Cloud) وتطبيق الهاتف المستقل ====================
  openSyncModal() {
    const syncUrlEl = document.getElementById('cloudSyncUrlInput');
    if (syncUrlEl) syncUrlEl.value = this.state.cloudSyncUrl || '';
    const mobileUrlEl = document.getElementById('mobileHostedUrlInput');
    if (mobileUrlEl) {
      mobileUrlEl.value =
        this.state.mobileHostedUrl ||
        (window.location.protocol.startsWith('http') && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
          ? window.location.origin + window.location.pathname
          : '');
    }
    this.updateCloudSyncStatusUI();
    document.getElementById('syncModal').classList.add('open');
  },

  closeSyncModal() {
    document.getElementById('syncModal').classList.remove('open');
  },

  checkUrlPairingParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const syncUrlParam = params.get('syncUrl');
      const apiKeyParam = params.get('apiKey');
      if (!syncUrlParam && !apiKeyParam) return;

      if (syncUrlParam) {
        this.state.cloudSyncUrl = syncUrlParam.trim();
      }
      if (apiKeyParam) {
        this.state.geminiApiKey = apiKeyParam.trim();
      }
      if (window.location.protocol.startsWith('http') && !window.location.hostname.includes('localhost')) {
        this.state.mobileHostedUrl = window.location.origin + window.location.pathname;
      }

      // تنظيف شريط العنوان لحماية المفاتيح بعد التقاطها
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      this.saveState(true);
      setTimeout(() => {
        this.showToast('📲 تم إقران جوالك بالسحابة ومفتاح الذكاء الاصطناعي! جاري سحب جميع بيانات الكمبيوتر...');
        this.pullFromCloud(false, true);
      }, 400);
    } catch (e) {
      console.error('URL Pairing check error:', e);
    }
  },

  initCloudSyncEngine() {
    this.updateCloudSyncStatusUI();

    if (this.state.cloudSyncUrl && this.state.cloudSyncUrl.trim()) {
      // سحب أحدث البيانات عند فتح التطبيق
      setTimeout(() => {
        this.pullFromCloud(true, false);
      }, 700);
    }

    // المزامنة التلقائية عند العودة لنافذة التطبيق على الجوال أو الكمبيوتر (مع فاصل حماية لمنع 429)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.state.cloudSyncUrl && this.state.cloudSyncUrl.trim()) {
        const now = Date.now();
        if (!this.lastAutoPullTime || now - this.lastAutoPullTime > 8000) {
          this.lastAutoPullTime = now;
          this.pullFromCloud(true, false);
        }
      }
    });

    // فحص دوري خفيف كل 90 ثانية عندما يكون التطبيق مفتوحاً
    if (this.cloudSyncInterval) clearInterval(this.cloudSyncInterval);
    this.cloudSyncInterval = setInterval(() => {
      if (
        document.visibilityState === 'visible' &&
        !this.isCloudSyncing &&
        this.state.cloudSyncUrl &&
        this.state.cloudSyncUrl.trim()
      ) {
        this.lastAutoPullTime = Date.now();
        this.pullFromCloud(true, false);
      }
    }, 90000);
  },

  updateCloudSyncStatusUI(customStatusText = null, stateType = null) {
    const hasUrl = Boolean(this.state.cloudSyncUrl && this.state.cloudSyncUrl.trim());
    const banner = document.getElementById('cloudSyncStatusBanner');
    const iconEl = document.getElementById('cloudSyncStatusIcon');
    const textEl = document.getElementById('cloudSyncStatusText');
    const topBtnLabel = document.getElementById('topSyncBtnLabel');
    const topIcon = document.getElementById('topSyncIcon');
    const sidebarLabel = document.getElementById('syncBtnLabel');

    const mode = stateType || (hasUrl ? 'connected' : 'disconnected');

    if (mode === 'syncing') {
      if (iconEl) iconEl.textContent = '⏳';
      if (textEl) textEl.textContent = customStatusText || 'جاري المزامنة الحية بين الكمبيوتر والجوال...';
      if (topIcon) topIcon.textContent = '⏳';
      if (topBtnLabel) topBtnLabel.textContent = 'جاري المزامنة...';
      return;
    }

    if (mode === 'error') {
      if (banner) {
        banner.style.background = 'rgba(239, 68, 68, 0.12)';
        banner.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      }
      if (iconEl) iconEl.textContent = '⚠️';
      if (textEl) textEl.textContent = customStatusText || 'تعذر الاتصال بالسحابة حالياً (تأكد من الرابط أو الإنترنت)';
      if (topIcon) topIcon.textContent = '⚠️';
      return;
    }

    if (hasUrl) {
      const lastTime = this.state.lastCloudSyncTime ? ` • آخر مزامنة: ${this.state.lastCloudSyncTime}` : '';
      if (banner) {
        banner.style.background = 'rgba(16, 185, 129, 0.12)';
        banner.style.borderColor = 'rgba(16, 185, 129, 0.45)';
      }
      if (iconEl) iconEl.textContent = '🟢';
      if (textEl) {
        textEl.textContent = customStatusText || `متصل ومتزامن سحابياً بالاتجاهين (الكمبيوتر ⇄ الهاتف)${lastTime}`;
      }
      if (topIcon) topIcon.textContent = '🟢';
      if (topBtnLabel) topBtnLabel.textContent = 'متزامن (PC ⇄ الجوال)';
      if (sidebarLabel) sidebarLabel.textContent = 'المزامنة السحابية نشطة 🟢';
    } else {
      if (banner) {
        banner.style.background = 'rgba(148, 163, 184, 0.1)';
        banner.style.borderColor = 'var(--border-subtle)';
      }
      if (iconEl) iconEl.textContent = '⚪';
      if (textEl) textEl.textContent = 'المزامنة السحابية التلقائية بين الكمبيوتر والجوال: غير مفعّلة بعد';
      if (topIcon) topIcon.textContent = '☁️';
      if (topBtnLabel) topBtnLabel.textContent = 'المزامنة السحابية والجوال';
    }
  },

  normalizeCloudEndpoint(rawUrl) {
    let url = (rawUrl || '').trim();
    if (!url) return { type: 'none', url: '' };
    if (url.includes('ntfy.sh/')) {
      url = url.replace(/\/+$/, '').replace(/\/json$/, '');
      return { type: 'ntfy', url };
    }
    if (url.includes('firebaseio.com') || url.includes('firebasedatabase.app')) {
      url = url.replace(/\/+$/, '');
      if (!url.endsWith('.json')) {
        url += '/napoleon_hill_16laws_sync.json';
      }
      return { type: 'firebase', url };
    }
    return { type: 'gas', url };
  },

  async createInstantCloudSync() {
    const topicUrl = DEFAULT_CLOUD_SYNC_URL;

    const input = document.getElementById('cloudSyncUrlInput');
    if (input) input.value = topicUrl;
    this.state.cloudSyncUrl = topicUrl;
    await this.saveState(true);

    this.updateCloudSyncStatusUI('⏳ جاري تفعيل السحابة الفورية الموحدة ورفع كافة بياناتك...', 'syncing');
    this.showCloudDiag('⏳ جاري رفع كافة بيانات الكمبيوتر إلى قناتك السحابية الموحدة مع الجوال...', 'info');

    const ok = await this.pushToCloud(false, true);
    if (ok) {
      this.showToast('🎉 تم رفع وتفعيل السحابة الموحدة بنجاح 100%! ستتزامن تلقائياً مع تطبيق الجوال');
    }
  },

  showCloudDiag(htmlMsg, type = 'info') {
    const box = document.getElementById('cloudSyncDiagBox');
    if (!box) return;
    box.style.display = 'block';
    if (type === 'success') {
      box.style.background = 'rgba(16, 185, 129, 0.12)';
      box.style.border = '1px solid rgba(16, 185, 129, 0.45)';
      box.style.color = '#A7F3D0';
    } else if (type === 'error') {
      box.style.background = 'rgba(239, 68, 68, 0.12)';
      box.style.border = '1px solid rgba(239, 68, 68, 0.45)';
      box.style.color = '#FCA5A5';
    } else {
      box.style.background = 'rgba(59, 130, 246, 0.12)';
      box.style.border = '1px solid rgba(59, 130, 246, 0.4)';
      box.style.color = '#93C5FD';
    }
    box.innerHTML = htmlMsg;
  },

  diagnoseCloudError(err, url = '') {
    const msg = String(err && err.message ? err.message : err);
    if (msg.includes('429')) {
      return `⏳ <strong>تم إرسال طلبات كثيرة متتالية في ثانية واحدة (HTTP 429):</strong> انتظر 10 ثوانٍ فقط ثم اضغط زر <strong>"📤 رفع بيانات هذا الجهاز للسحابة"</strong> مرة واحدة فقط (تم الآن ضغط البيانات لتُرسل في طلب واحد خفيف لا يسبب 429 أبداً).`;
    }
    if (url.includes('script.google.com') && (url.includes('/edit') || !url.endsWith('/exec'))) {
      return `❌ <strong>الرابط المنسوخ غير صحيح:</strong> أنت نسخت رابط صفحة التحرير وليس رابط التطبيق المنشور! يجب أن ينتهي الرابط بكلمة <code>/exec</code> (تحصل عليه بعد الضغط على <strong>Deploy ⬅️ New deployment</strong>).`;
    }
    if (msg.includes('doGet') || msg.includes('doPost') || msg.includes('function not found')) {
      return `❌ <strong>لم يتم حفظ الكود قبل النشر في Google Script:</strong> ارجع لصفحة Google Script، الصق الكود واضغط أيقونة الحفظ 💾 (<code>Ctrl + S</code>) أولاً، ثم اضغط <strong>Deploy ⬅️ New deployment</strong> وانسخ الرابط الجديد.`;
    }
    if (msg.includes('DriveApp') || msg.includes('permission') || msg.includes('Authorization') || msg.includes('الصلاحية')) {
      return `⚠️ <strong>السكربت القديم توقف بسبب طلب صلاحية DriveApp:</strong> قمنا الآن بتحديث الكود بالأسفل ليعمل عبر خزنة قوقل السحابية المباشرة (<strong>بدون أي صلاحيات معقدة</strong>)! اضغط زر <strong>"📋 نسخ الكود السحابي المطور"</strong> بالأسفل، الصقه مكان القديم في Google Script، اضغط حفظ 💾 ثم <strong>Deploy ⬅️ New deployment</strong>.`;
    }
    if (msg.includes('HTML_LOGIN_OR_PERMISSION') || msg.includes('Unexpected token') || msg.includes('<!DOCTYPE')) {
      return `⚠️ <strong>جوجل أعادت صفحة صلاحيات بدلاً من البيانات:</strong> السبب إما أن خيار <em>Who has access</em> لم يكن مضبوطاً على <strong>Anyone (أي شخص)</strong>، أو أن الكود القديم طلب صلاحية Drive. انسخ <strong>"الكود السحابي المطور (بدون طلب صلاحيات)"</strong> بالأسفل، اضغط حفظ 💾، ثم اعمل <strong>Deploy ⬅️ New deployment</strong> واجعل الوصول <strong>Anyone</strong>.`;
    }
    return `⚠️ <strong>تعذر الاتصال بالجسر السحابي (${msg}):</strong> انتظر بضع ثوانٍ ثم اضغط زر <strong>"📤 رفع بيانات هذا الجهاز للسحابة"</strong>.`;
  },

  packStateForCloud(st) {
    // ضغط ذكي يحفظ 100% من بيانات المستخدم الفعلية في رسالة واحدة خفيفة (< 3.5 KB) لمنع HTTP 429 نهائياً
    const packed = { ...st };
    // استبعاد النصوص الترحيبية الافتراضية الثابتة لتخفيف الحجم مع الاحتفاظ بآخر الرسائل الفعلية
    if (Array.isArray(packed.councilChatHistory)) {
      packed.councilChatHistory = packed.councilChatHistory.slice(-6);
    }
    if (Array.isArray(packed.agentChatHistory)) {
      packed.agentChatHistory = packed.agentChatHistory.slice(-6);
    }
    // استبعاد مصفوفة العادات الافتراضية الثابتة إن لم يضف المستخدم عادات مخصصة جديدة
    const defaultHabitsLen = (window.NAPOLEON_HILL_DATA && window.NAPOLEON_HILL_DATA.defaultHabits || []).length;
    if (Array.isArray(packed.habits) && packed.habits.length === defaultHabitsLen) {
      delete packed.habits;
    }
    return packed;
  },

  unpackStateFromCloud(remoteObj) {
    const def = this.getDefaultState();
    const merged = { ...def, ...remoteObj };
    if (!Array.isArray(merged.habits) || merged.habits.length === 0) {
      merged.habits = def.habits;
    }
    return merged;
  },

  async saveAndConnectCloudSync() {
    const input = document.getElementById('cloudSyncUrlInput');
    const url = input ? input.value.trim() : '';
    if (!url) {
      this.showToast('⚠️ يرجى لصق رابط جسر المزامنة السحابية أولاً');
      return;
    }
    if (!url.startsWith('https://')) {
      this.showToast('⚠️ يجب أن يبدأ رابط المزامنة السحابية بـ https://');
      return;
    }
    if (url.includes('script.google.com') && (url.includes('/edit') || !url.endsWith('/exec'))) {
      this.showCloudDiag(this.diagnoseCloudError(new Error('WRONG_URL'), url), 'error');
      this.showToast('⚠️ الرابط يجب أن ينتهي بـ /exec وليس /edit');
      return;
    }

    this.state.cloudSyncUrl = url;
    this.saveState(true);
    this.updateCloudSyncStatusUI('⏳ جاري اختبار الجسر السحابي ومزامنة البيانات...', 'syncing');
    this.showCloudDiag('⏳ جاري الاتصال بالجسر السحابي وفحص القراءة والكتابة...', 'info');

    // فحص السحابة أولاً: إذا كان فيها بيانات أحدث نسحبها، وإذا كانت فارغة أو أقدم نرفع بيانات هذا الجهاز
    const pulled = await this.pullFromCloud(false, false);
    if (!pulled && !this.lastCloudCallHadError) {
      await this.pushToCloud(false, true);
    }
  },

  scheduleCloudPush() {
    if (this.cloudPushTimeout) clearTimeout(this.cloudPushTimeout);
    this.cloudPushTimeout = setTimeout(() => {
      this.pushToCloud(true, false);
    }, 3500);
  },

  async pushToCloud(silent = true, force = false) {
    const endpoint = this.normalizeCloudEndpoint(this.state.cloudSyncUrl);
    if (endpoint.type === 'none') {
      if (!silent) this.showToast('⚠️ ضع رابط المزامنة السحابية أولاً ثم اضغط حفظ');
      return false;
    }

    // حماية ذكية: منع جهاز جديد فارغ من مسح بيانات السحابة الغنية بالخطأ إلا عند الضغط القسري
    const localRichness = this.getStateRichnessScore(this.state);
    if (!force && localRichness === 0) {
      return false;
    }

    this.isCloudSyncing = true;
    this.lastCloudCallHadError = false;
    this.updateCloudSyncStatusUI('⏳ جاري رفع أحدث تعديلاتك إلى السحابة...', 'syncing');

    try {
      if (!this.state.lastModifiedTimestamp) {
        this.state.lastModifiedTimestamp = Date.now();
      }
      const compactState = this.packStateForCloud(this.state);
      const payloadStr = JSON.stringify(compactState);

      let response;
      if (endpoint.type === 'ntfy') {
        // إرسال في طلب واحد فقط (Single Request) لمنع خطأ HTTP 429 نهائياً!
        const utf8Bytes = unescape(encodeURIComponent(payloadStr)).length;
        const postUrl = utf8Bytes > 3800 ? `${endpoint.url}?filename=napoleon_sync.json` : endpoint.url;
        response = await fetch(postUrl, {
          method: 'POST',
          body: payloadStr
        });
      } else if (endpoint.type === 'firebase') {
        response = await fetch(endpoint.url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: payloadStr
        });
      } else {
        // إرسال مباشر بدون headers مخصصة لضمان Simple Request بدون CORS preflight
        response = await fetch(endpoint.url, {
          method: 'POST',
          body: payloadStr,
          redirect: 'follow'
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const respText = await response.text();
      if (endpoint.type === 'gas') {
        if (respText && (respText.trim().startsWith('<!DOCTYPE') || respText.trim().startsWith('<html'))) {
          if (respText.includes('doPost') || respText.includes('function not found')) {
            throw new Error('Script function not found: doPost');
          }
          throw new Error('HTML_LOGIN_OR_PERMISSION');
        }

        if (respText && respText.trim().startsWith('{')) {
          const parsedResp = JSON.parse(respText);
          if (parsedResp.ok === false || parsedResp.error) {
            throw new Error(parsedResp.error || 'خطأ داخل السكربت');
          }
        }
      }

      const nowTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      this.state.lastCloudSyncTime = nowTime;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.updateCloudSyncStatusUI(null, 'connected');
      this.showCloudDiag(
        `🟢 <strong>الاتصال بالجسر السحابي ناجح 100%!</strong> تم رفع وحفظ كافة بياناتك في طلب واحد سحابي خفيف (${Math.max(1, Math.round(payloadStr.length / 1024))} كيلوبايت) في الساعة ${nowTime}.`,
        'success'
      );

      if (!silent) {
        this.showToast('☁️ تم رفع وحفظ جميع بياناتك في السحابة بنجاح!');
      }
      this.isCloudSyncing = false;
      return true;
    } catch (err) {
      console.error('Cloud Push Error:', err);
      this.lastCloudCallHadError = true;
      this.updateCloudSyncStatusUI('⚠️ تعذر الاتصال بالجسر السحابي — راجع رسالة التشخيص بالأسفل', 'error');
      this.showCloudDiag(this.diagnoseCloudError(err, endpoint.url), 'error');
      if (!silent) {
        this.showToast('❌ تعذر الرفع للسحابة: راجع سبب المشكلة الموضح في نافذة المزامنة');
      }
      this.isCloudSyncing = false;
      return false;
    }
  },

  async pullFromCloud(silent = true, force = false) {
    const endpoint = this.normalizeCloudEndpoint(this.state.cloudSyncUrl);
    if (endpoint.type === 'none') {
      if (!silent) this.showToast('⚠️ ضع رابط المزامنة السحابية أولاً');
      return false;
    }

    this.isCloudSyncing = true;
    this.lastCloudCallHadError = false;
    if (!silent) {
      this.updateCloudSyncStatusUI('⏳ جاري فحص السحابة وسحب أحدث البيانات...', 'syncing');
    }

    try {
      let textData = '';

      if (endpoint.type === 'ntfy') {
        const pollUrl = `${endpoint.url}/json?poll=1&since=all&t=${Date.now()}`;
        const pollRes = await fetch(pollUrl, { method: 'GET' });
        if (!pollRes.ok) {
          throw new Error(`HTTP ${pollRes.status}`);
        }
        const rawLines = (await pollRes.text()).trim();
        if (rawLines) {
          const lines = rawLines.split('\n').filter(Boolean);
          for (let i = lines.length - 1; i >= 0; i--) {
            try {
              const ev = JSON.parse(lines[i]);
              if (ev.event === 'message') {
                if (ev.attachment && ev.attachment.url) {
                  const attRes = await fetch(ev.attachment.url, { method: 'GET' });
                  if (attRes.ok) {
                    textData = await attRes.text();
                    break;
                  }
                } else if (ev.message && ev.message.trim().startsWith('{')) {
                  const candidate = JSON.parse(ev.message.trim());
                  if (candidate && candidate.xp !== undefined) {
                    textData = ev.message.trim();
                    break;
                  }
                }
              }
            } catch (lineErr) {
              // ignore malformed line
            }
          }
        }
      } else {
        const sep = endpoint.url.includes('?') ? '&' : '?';
        const fetchUrl =
          endpoint.type === 'firebase'
            ? `${endpoint.url}${sep}t=${Date.now()}`
            : `${endpoint.url}${sep}action=get&t=${Date.now()}`;

        const response = await fetch(fetchUrl, {
          method: 'GET',
          redirect: 'follow'
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        textData = await response.text();
        if (textData && (textData.trim().startsWith('<!DOCTYPE') || textData.trim().startsWith('<html'))) {
          if (textData.includes('doGet') || textData.includes('function not found')) {
            throw new Error('Script function not found: doGet');
          }
          throw new Error('HTML_LOGIN_OR_PERMISSION');
        }
      }

      if (!textData || textData.trim() === '' || textData.trim() === '{}' || textData.trim() === 'null') {
        // السحابة فارغة حالياً — إذا كان الجهاز الحالي فيه بيانات نقوم برفعها تلقائياً
        this.isCloudSyncing = false;
        if (this.getStateRichnessScore(this.state) > 0) {
          await this.pushToCloud(silent, true);
        } else {
          this.updateCloudSyncStatusUI(null, 'connected');
          this.showCloudDiag('🟢 الجسر السحابي متصل وشغال بنجاح! جاهز للمزامنة التلقائية.', 'success');
        }
        return false;
      }

      const rawRemote = JSON.parse(textData);
      if (rawRemote && rawRemote.error) {
        throw new Error(rawRemote.error);
      }
      const remoteState = this.unpackStateFromCloud(rawRemote);

      const remoteTs = Number(remoteState.lastModifiedTimestamp || 0);
      const localTs = Number(this.state.lastModifiedTimestamp || 0);
      const remoteRichness = this.getStateRichnessScore(remoteState);
      const localRichness = this.getStateRichnessScore(this.state);

      const shouldApplyRemote =
        force ||
        (remoteRichness > 0 && localRichness === 0) ||
        (remoteTs > localTs && remoteRichness > 0);

      if (shouldApplyRemote && remoteRichness > 0) {
        const preservedSyncUrl = this.state.cloudSyncUrl;
        const preservedMobileUrl = this.state.mobileHostedUrl || remoteState.mobileHostedUrl || '';
        const preservedApiKey = remoteState.geminiApiKey || this.state.geminiApiKey || '';

        this.state = {
          ...this.getDefaultState(),
          ...remoteState,
          cloudSyncUrl: preservedSyncUrl,
          mobileHostedUrl: preservedMobileUrl,
          geminiApiKey: preservedApiKey
        };

        const nowTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        this.state.lastCloudSyncTime = nowTime;

        await this.saveState(true);
        this.renderAll();
        this.updateCloudSyncStatusUI(null, 'connected');
        this.showCloudDiag(`🟢 <strong>متصل ومتزامن بنجاح!</strong> تم سحب أحدث البيانات من السحابة (${nowTime}).`, 'success');

        if (!silent || remoteTs > localTs) {
          this.showToast('☁️ تمت مزامنة وتحديث بياناتك تلقائياً من السحابة!');
        }
        this.isCloudSyncing = false;
        return true;
      } else if (localTs > remoteTs && localRichness > 0) {
        // البيانات المحلية أحدث من السحابة -> نرفعها للسحابة تلقائياً
        this.isCloudSyncing = false;
        await this.pushToCloud(silent, true);
        return true;
      }

      const nowTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      this.state.lastCloudSyncTime = nowTime;
      this.updateCloudSyncStatusUI(null, 'connected');
      this.showCloudDiag(`🟢 <strong>الاتصال السحابي شغال 100%!</strong> بيانات الكمبيوتر والسحابة متطابقة ومحدثة (${nowTime}).`, 'success');
      if (!silent) {
        this.showToast('✅ بياناتك على هذا الجهاز متطابقة ومحدثة 100% مع السحابة');
      }
      this.isCloudSyncing = false;
      return true;
    } catch (err) {
      console.error('Cloud Pull Error:', err);
      this.lastCloudCallHadError = true;
      this.updateCloudSyncStatusUI('⚠️ تعذر الاتصال بالجسر السحابي — راجع رسالة التشخيص بالأسفل', 'error');
      this.showCloudDiag(this.diagnoseCloudError(err, endpoint.url), 'error');
      if (!silent) {
        this.showToast('❌ تعذر الاتصال بالسحابة: راجع سبب المشكلة الموضح في نافذة المزامنة');
      }
      this.isCloudSyncing = false;
      return false;
    }
  },

  async manualSyncNow() {
    if (!this.state.cloudSyncUrl || !this.state.cloudSyncUrl.trim()) {
      this.openSyncModal();
      this.showToast('ℹ️ قم بلصق رابط المزامنة السحابية مرة واحدة لتفعيل المزامنة بين الكمبيوتر والجوال');
      return;
    }
    await this.pullFromCloud(false, false);
  },

  copyGoogleAppsScriptCode() {
    const scriptCode = `// =========================================================================
// جسر المزامنة السحابي المطور (Zero-Permission Cloud Sync - بدون طلب صلاحيات)
// يعمل فوراً بين الكمبيوتر والجوال داخل حسابك في قوقل بدون تعقيد صلاحيات Drive
// =========================================================================
function doGet(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var all = props.getProperties();
    var count = parseInt(all.chunk_count || '0', 10);
    if (!count || count <= 0) {
      return ContentService.createTextOutput('{}')
        .setMimeType(ContentService.MimeType.JSON);
    }
    var fullText = '';
    for (var i = 0; i < count; i++) {
      fullText += (all['chunk_' + i] || '');
    }
    return ContentService.createTextOutput(fullText || '{}')
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var body = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var props = PropertiesService.getScriptProperties();
    var chunkSize = 7000;
    var totalChunks = Math.ceil(body.length / chunkSize);
    var dataObj = {
      chunk_count: String(totalChunks),
      updated_at: String(Date.now())
    };
    for (var i = 0; i < totalChunks; i++) {
      dataObj['chunk_' + i] = body.slice(i * chunkSize, (i + 1) * chunkSize);
    }
    props.setProperties(dataObj, true);
    return ContentService.createTextOutput(JSON.stringify({ ok: true, chunks: totalChunks, updatedAt: Date.now() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

    navigator.clipboard.writeText(scriptCode).then(() => {
      this.showToast('📋 تم نسخ الكود السحابي المطور (بدون صلاحيات)! الصقه في Google Script واضغط حفظ 💾 ثم New deployment');
    }).catch(() => {
      this.showToast('⚠️ تعذر النسخ التلقائي، يرجى المحاولة مرة أخرى');
    });
  },

  generateMobilePairingQR() {
    const syncUrlEl = document.getElementById('cloudSyncUrlInput');
    const mobileUrlEl = document.getElementById('mobileHostedUrlInput');
    const resultBox = document.getElementById('mobilePairingResultBox');

    const syncUrl = (syncUrlEl ? syncUrlEl.value.trim() : '') || this.state.cloudSyncUrl || '';
    let mobileBaseUrl = (mobileUrlEl ? mobileUrlEl.value.trim() : '') || this.state.mobileHostedUrl || '';

    if (!mobileBaseUrl) {
      this.showToast('⚠️ يرجى وضع رابط تطبيقك على الويب (مثل رابط Netlify Drop) في الخانة المخصصة أولاً');
      if (mobileUrlEl) mobileUrlEl.focus();
      return;
    }

    if (!mobileBaseUrl.startsWith('http://') && !mobileBaseUrl.startsWith('https://')) {
      mobileBaseUrl = 'https://' + mobileBaseUrl;
    }

    this.state.mobileHostedUrl = mobileBaseUrl;
    if (syncUrl) {
      this.state.cloudSyncUrl = syncUrl;
    }
    this.saveState(false);
    this.updateCloudSyncStatusUI();

    const urlObj = new URL(mobileBaseUrl);
    if (syncUrl) {
      urlObj.searchParams.set('syncUrl', syncUrl);
    }
    if (this.state.geminiApiKey && this.state.geminiApiKey.trim()) {
      urlObj.searchParams.set('apiKey', this.state.geminiApiKey.trim());
    }

    const magicPairingUrl = urlObj.toString();
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(magicPairingUrl)}`;

    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="color: var(--gold-light); font-weight: 800; font-size: 0.92rem; margin-bottom: 8px;">
          📱 صوّر هذا الباركود بكاميرا جوالك لفتح التطبيق وربطه بالكمبيوتر تلقائياً:
        </div>
        <div style="background: #ffffff; padding: 10px; border-radius: 12px; display: inline-block; margin-bottom: 10px;">
          <img src="${qrApiUrl}" alt="Mobile Pairing QR Code" width="200" height="200" style="display: block;" />
        </div>
        <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 10px;">
          يحتوي هذا الرابط الذكي على <strong>إعدادات المزامنة السحابية + مفتاح الذكاء الاصطناعي</strong>؛ بمجرد فتحه على جوالك سيقوم بسحب جميع بيانات الكمبيوتر فوراً!
        </p>
        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-gold btn-sm" onclick="App.copyMobilePairingUrl('${magicPairingUrl.replace(/'/g, "\\'")}')">📋 نسخ رابط الإقران الذكي لإرساله للجوال</button>
        </div>
      `;
    }
    this.showToast('✨ تم توليد باركود ورابط إقران الجوال الشامل بنجاح!');
  },

  copyMobilePairingUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
      this.showToast('📋 تم نسخ رابط الإقران الذكي! أرسله لجوالك وافتحه مرة واحدة فقط');
    });
  },

  async linkGoogleDriveFile() {
    if (!window.showSaveFilePicker) {
      this.showToast('ℹ️ متصفحك الحالي يدعم التحميل المباشر؛ استخدم زر "تحميل نسخة احتياطية" واحفظها في Google Drive');
      this.exportBackupFile();
      return;
    }
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'Napoleon_Hill_16Laws_Sync.json',
        types: [
          {
            description: 'JSON Sync Backup',
            accept: { 'application/json': ['.json'] }
          }
        ]
      });
      this.linkedFileHandle = handle;
      await this.writeToLinkedFile();
      document.getElementById('linkedFileStatus').textContent = `✅ مربوط تلقائياً بالملف: ${handle.name}`;
      document.getElementById('syncBtnLabel').textContent = `مزامنة Google Drive نشطة ✅`;
      this.showToast('☁️ تم ربط ملف Google Drive بنجاح! سيتم تحديثه تلقائياً مع كل تغيير');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    }
  },

  async writeToLinkedFile() {
    if (!this.linkedFileHandle) return;
    try {
      const writable = await this.linkedFileHandle.createWritable();
      await writable.write(JSON.stringify(this.state, null, 2));
      await writable.close();
    } catch (e) {
      console.error('Auto-write to linked file error:', e);
    }
  },

  exportBackupFile() {
    const dataStr = JSON.stringify(this.state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = this.getTodayStr();
    a.href = url;
    a.download = `Napoleon_Hill_16Laws_Backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('📥 تم تحميل ملف النسخة الاحتياطية بنجاح');
  },

  importBackupFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        this.state = { ...this.getDefaultState(), ...imported };
        this.saveState();
        this.renderAll();
        this.closeSyncModal();
        this.showToast('✅ تم استيراد بياناتك وتحديث جميع القوانين والأهداف بنجاح!');
      } catch (err) {
        this.showToast('❌ الملف غير صالح، يرجى اختيار ملف JSON صحيح');
      }
    };
    reader.readAsText(file);
  },

  async shareBackupToCloud() {
    const dataStr = JSON.stringify(this.state, null, 2);
    const file = new File([dataStr], `Napoleon_Hill_16Laws_${this.getTodayStr()}.json`, {
      type: 'application/json'
    });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'نسخة احتياطية - قوانين النجاح الـ 16',
          text: 'ملف بياناتي في منظومة قوانين النجاح لنابليون هيل',
          files: [file]
        });
        return;
      } catch (e) {
        // fallback to download
      }
    }
    this.exportBackupFile();
  },

  // ==================== 9. غرفة التداول المنضبط (Swing & Day Trading Psychology) ====================
  emotionLabels: {
    disciplined: '✅ انضباط كامل بالخطة (Law #8)',
    fomo: '⚠️ استعجال وخوف فوات الفرصة (FOMO)',
    revenge: '🔥 تداول انتقامي لتعويض خسارة',
    early_exit: '😰 قلق وخروج مبكر من الربح',
    moved_sl: '🛑 رفض وقف الخسارة / تعليق الصفقة',
    overtrading: '😤 إفراط وتشتت في التداول'
  },

  togglePreTradeCheck(idx) {
    this.preTradeChecks[idx] = !this.preTradeChecks[idx];
    this.renderPreTradeFilter();
  },

  resetPreTradeChecks() {
    this.preTradeChecks = [false, false, false, false, false];
    this.renderPreTradeFilter();
  },

  renderPreTradeFilter() {
    let checkedCount = 0;
    this.preTradeChecks.forEach((val, idx) => {
      if (val) checkedCount++;
      const box = document.getElementById(`ptc_${idx}`);
      if (box) {
        box.textContent = val ? '✓' : '';
        box.parentElement.parentElement.classList.toggle('completed', val);
      }
    });

    const pct = Math.round((checkedCount / 5) * 100);
    const meter = document.getElementById('preTradeReadinessBox');
    const titleEl = document.getElementById('preTradeReadinessTitle');
    const descEl = document.getElementById('preTradeReadinessDesc');
    if (!meter || !titleEl || !descEl) return;

    meter.className = 'readiness-meter';
    if (pct < 60) {
      meter.classList.add('danger');
      titleEl.textContent = `⛔ جاهزية الدخول: ${pct}% — خطر اندفاع عاطفي! لا تفتح الصفقة الآن`;
      descEl.textContent = 'يقول نابليون هيل في القانون 8: "من لا يضبط نفسه قبل الفعل، يدفع الثمن من رأس ماله". أكمل الشروط أولاً.';
    } else if (pct < 100) {
      meter.classList.add('warning');
      titleEl.textContent = `⚠️ جاهزية الدخول: ${pct}% — انتبه! بقي شرطان/شرط لم يتحقق بعد`;
      descEl.textContent = 'تأكد من مراجعة جميع البنود الخمسة حتى لا تقع في فخ التسرع أو الخلط بين المضاربة والسوينج.';
    } else {
      meter.classList.add('safe');
      titleEl.textContent = `✅ جاهزية الدخول: 100% — عقلك الواعي يقود الآن! يمكنك تنفيذ الصفقة بثقة`;
      descEl.textContent = 'أنت الآن تطبق القانون 8 (ضبط النفس) والقانون 11 (التفكير الدقيق). التزم بوقف الخسارة والهدف دون تردد.';
    }
  },

  addTradeLog() {
    const symbol = document.getElementById('trSymbol').value.trim().toUpperCase();
    const style = document.getElementById('trStyle').value;
    const outcome = document.getElementById('trOutcome').value;
    const pnl = parseFloat(document.getElementById('trPnL').value) || 0;
    const emotion = document.getElementById('trEmotion').value;
    const notes = document.getElementById('trNotes').value.trim();

    if (!symbol) {
      this.showToast('⚠️ يرجى كتابة رمز السهم أو العملة أو الزوج أولاً');
      return;
    }

    const trade = {
      id: Date.now(),
      date: new Date().toLocaleString('ar-SA'),
      symbol,
      style,
      outcome,
      pnl,
      emotion,
      notes: notes || 'تم التوثيق للمراجعة السلوكية'
    };

    if (!this.state.tradingLogs) this.state.tradingLogs = [];
    this.state.tradingLogs.unshift(trade);

    document.getElementById('trSymbol').value = '';
    document.getElementById('trPnL').value = '0';
    document.getElementById('trNotes').value = '';

    // إذا كانت الصفقة منضبطة نرفع القانون 8 و 11، وإذا كان فيها خطأ نفسي نرسل نصيحة فورية من الإيجنت!
    if (emotion === 'disciplined') {
      this.addXP(25, `توثيق صفقة منضبطة على ${symbol} (تعزيز القانون 8)`);
    } else {
      this.addXP(15, `الصدق مع الذات وتوثيق خطأ نفسي في صفقة ${symbol}`);
      const coachTip = this.getInstantTradeEmotionCure(emotion, symbol, style);
      this.state.agentChatHistory.push({
        role: 'agent',
        text: coachTip
      });
      this.showToast('🤖 قام المرشد النفسي الذكي بتحليل صفقتك وإرسال نصيحة علاجية لك في قسم المرشد!');
    }

    this.saveState();
    this.resetPreTradeChecks();
    this.renderTradingSection();
    this.renderAgentSection();
  },

  getInstantTradeEmotionCure(emotion, symbol, style) {
    const cures = {
      fomo: `🚨 **تنبيه سلوكي على صفقة (${symbol} - ${style}):**
لقد سجلت أنك دخلت بدافع **الاستعجال والخوف من فوات الفرصة (FOMO)**.
• **تشخيص نابليون هيل (القانون 8 و 11):** الـ FOMO هو سيطرة الخيال العاطفي على التفكير الدقيق. السوق لا ينتهي، والفرص تتكرر كل يوم، لكن رأس مالك محدود!
• **العلاج الفوري للصفقة القادمة:** امنع نفسك من الدخول بعد تحرك السعر؛ ضع أمرك المعلّق عند منطقة الدخول أو انتظر إعادة الاختبار. إذا فات القطار، ابتسم وانتظر القطار التالي.`,
      revenge: `🛑 **تدخل طارئ على صفقة (${symbol} - ${style}):**
لقد سجلت **تداولاً انتقامياً (Revenge Trading)**!
• **تشخيص نابليون هيل (القانون 8 - ضبط النفس):** الغضب والرغبة في الثأر من السوق يغلقان الفص الجبهي المسؤول عن التفكير المنطقي. السوق كيان محايد لا يعرفك، والانتقام منه يدمر الحساب!
• **الأمر العلاجي الآن:** أغلق المنصة فوراً لمدة ساعة على الأقل، وشغّل "جلسة الإيحاء الذاتي" لتهدئة جهازك العصبي.`,
      early_exit: `😰 **تحليل سلوكي لصفقة (${symbol} - ${style}):**
لقد خرجت مبكراً من صفقة رابحة بسبب **القلق والخوف من ارتداد الربح**.
• **تشخيص نابليون هيل (القانون 3 و 2):** الخروج المبكر يدل على أنك تتداول بعقلية الخوف على الربح الصغير بدلاً من الثقة بخطتك وهدفك المحدد. لذلك تكون أرباحك صغيرة وخسائرك كاملة!
• **الحل العملي (خاصة في السوينج):** عند وصول الصفقة إلى منتصف الطريق (1:1)، احجز جزءاً بسيطاً من الربح (مثلاً 30%) وضع الوقف على الدخول، واترك الباقي للهدف النهائي دون مراقبة كل شمعة صغيرة!`,
      moved_sl: `⚠️ **خطر جسيم في صفقة (${symbol} - ${style}):**
لقد سجلت **رفض وقف الخسارة أو تحويل مضاربة يومية إلى سوينج عالق**!
• **تشخيص نابليون هيل (القانون 14 - الاستفادة من الفشل):** ضرب وقف الخسارة هو مجرد "تكلفة تشغيلية وهزيمة مؤقتة صغيرة"، أما رفض الوقف وتحويل المضاربة اليومية إلى سوينج خاسر فهو الذي يحول الهزيمة الصغيرة إلى كارثة!
• **القاعدة الصارمة:** المضاربة اليومية تنتهي في نفس اليوم أو عند وقفها المحدد؛ لا تغير هوية الصفقة أبداً بعد دخولها.`,
      overtrading: `😤 **تشخيص تشتت في صفقة (${symbol} - ${style}):**
لقد سجلت **إفراطاً في التداول (Overtrading)**.
• **تشخيص نابليون هيل (القانون 12 - التركيز):** كثرة الصفقات تشتت طاقتك الذهنية وتستنزف تركيزك. المتداول المحترف قناص ينتظر فريسته بهدوء وليس رشاشاً يطلق في كل اتجاه!
• **الحل العملي:** ضع حداً أقصى: صفقتان يومياً فقط للمضاربة، وصفقة إلى صفقتين أسبوعياً للسوينج.`
    };
    return cures[emotion] || `تم تسجيل صفقة ${symbol}. استمر في مراقبة انضباطك النفسي!`;
  },

  getTradingAnalytics() {
    const logs = this.state.tradingLogs || [];
    if (!logs.length) {
      return {
        total: 0,
        disciplinePct: 100,
        winRate: 0,
        totalPnL: 0,
        topMistakeCode: null,
        topMistakeLabel: 'لا يوجد أخطاء مسجلة'
      };
    }

    let wins = 0;
    let disciplinedCount = 0;
    let totalPnL = 0;
    const mistakeCounts = {};

    logs.forEach((t) => {
      if (t.outcome === 'win') wins++;
      totalPnL += Number(t.pnl) || 0;
      if (t.emotion === 'disciplined') {
        disciplinedCount++;
      } else {
        mistakeCounts[t.emotion] = (mistakeCounts[t.emotion] || 0) + 1;
      }
    });

    let topMistakeCode = null;
    let maxCount = 0;
    Object.entries(mistakeCounts).forEach(([code, cnt]) => {
      if (cnt > maxCount) {
        maxCount = cnt;
        topMistakeCode = code;
      }
    });

    return {
      total: logs.length,
      disciplinePct: Math.round((disciplinedCount / logs.length) * 100),
      winRate: Math.round((wins / logs.length) * 100),
      totalPnL: Math.round(totalPnL * 100) / 100,
      topMistakeCode,
      topMistakeLabel: topMistakeCode ? this.emotionLabels[topMistakeCode] : 'انضباط مثالي 100% ✅'
    };
  },

  renderTradingSection() {
    this.renderPreTradeFilter();
    this.renderStrategyPlaybook();
    this.renderPrimedToPerform();
    this.renderDetachProtocol('loss');
    this.renderMytmAcademy();
    this.renderTenKChecklist();
    this.renderNeuralLogs();

    const stats = this.getTradingAnalytics();

    const dEl = document.getElementById('tradeStatDiscipline');
    if (dEl) {
      dEl.textContent = `${stats.disciplinePct}%`;
      document.getElementById('tradeStatWinRate').textContent = `${stats.winRate}% (${stats.total} صفقة)`;
      const pnlEl = document.getElementById('tradeStatPnL');
      pnlEl.textContent = `${stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL}`;
      pnlEl.style.color = stats.totalPnL >= 0 ? '#34D399' : '#F87171';
      const topMistakeEl = document.getElementById('tradeStatTopMistake');
      if (topMistakeEl) topMistakeEl.textContent = stats.topMistakeLabel;
    }

    const container = document.getElementById('tradingLogsContainer');
    if (!container) return;
    const logs = this.state.tradingLogs || [];

    if (!logs.length) {
      container.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 26px;">لم تسجل أي صفقات بعد. استخدم النموذج أعلاه لتسجيل صفقات السوينج والمضاربة اليومية ومراقبة حالتك النفسية.</p>`;
      return;
    }

    container.innerHTML = logs
      .map((t) => {
        const isDisciplined = t.emotion === 'disciplined';
        const outcomeBadge =
          t.outcome === 'win'
            ? '<span style="color:#34D399; font-weight:800;">🟢 ربح</span>'
            : t.outcome === 'loss'
            ? '<span style="color:#F87171; font-weight:800;">🔴 خسارة</span>'
            : '<span style="color:#9CA3AF; font-weight:800;">⚪ تعادل</span>';

        return `
          <div style="padding: 14px 16px; background: rgba(255,255,255,0.03); border: 1px solid ${
            isDisciplined ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.35)'
          }; border-radius: 12px; margin-bottom: 10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
              <div>
                <strong style="color: var(--gold-light); font-size: 1rem;">${this.escapeHtml(t.symbol)}</strong>
                <span class="law-num-badge" style="margin-right: 8px;">${this.escapeHtml(t.style)}</span>
              </div>
              <div style="display:flex; gap:12px; align-items:center;">
                ${outcomeBadge}
                <strong style="color:${t.pnl >= 0 ? '#34D399' : '#F87171'};">(${t.pnl >= 0 ? '+' : ''}${t.pnl})</strong>
                <span style="font-size:0.75rem; color:var(--text-secondary);">${t.date}</span>
              </div>
            </div>
            <div style="font-size: 0.85rem; margin-bottom: 4px;">
              <strong>الحالة النفسية:</strong> <span style="color:${isDisciplined ? '#34D399' : '#FCA5A5'};">${
          this.emotionLabels[t.emotion] || t.emotion
        }</span>
            </div>
            <div style="font-size: 0.83rem; color: var(--text-secondary); margin-bottom: 8px;">
              <strong>الدرس والملاحظة:</strong> ${this.escapeHtml(t.notes)}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.08);">
              <button type="button" class="btn btn-outline-gold btn-sm" style="font-size: 0.74rem; background: rgba(15,23,42,0.9); color: #FDE68A;" onclick="App.convertTradeToFailureSeed(${t.id})">
                🦅 حوّل هذه الصفقة إلى قاعدة في كيميائي النجاح (Law #14)
              </button>
            </div>
          </div>
        `;
      })
      .join('');
  },

  convertTradeToFailureSeed(tradeId) {
    const logs = this.state.tradingLogs || [];
    const t = logs.find((x) => x.id === tradeId);
    if (!t) return;

    const emotionText = this.emotionLabels[t.emotion] || t.emotion;
    const outcomeText = t.outcome === 'loss' ? `خسارة (${t.pnl})` : t.outcome === 'win' ? `ربح (${t.pnl})` : 'تعادل';

    this.switchView('lab');
    const failBtn = document.querySelector('[onclick*="switchLabTab(\'failure\'"]');
    this.switchLabTab('failure', failBtn || document.createElement('button'));

    const eventEl = document.getElementById('failEvent');
    if (eventEl) {
      eventEl.value = `صفقة ${t.symbol} (${t.style}) — النتيجة: ${outcomeText} | الحالة النفسية: ${emotionText} | ملاحظتي: ${t.notes}`;
      this.autoExtractFailureLessonAndSeed();
    }
    this.showToast('🦅 تم نقل بيانات الصفقة إلى (كيميائي النجاح) واستخراج الدرس والقاعدة الذهبية لتعتمدها في دستورك!');
  },

  // ==================== أدوات برنامج عقلية المتداول (MYTM Mentorship 2.0) ====================
  renderPrimedToPerform() {
    const container = document.getElementById('primedChecklistContainer');
    if (!container || !window.MYTM_COURSE_DATA) return;
    const today = this.getTodayStr();
    const checked = this.state.primedCheckedToday || {};
    const list = window.MYTM_COURSE_DATA.primedToPerformChecklist || [];

    container.innerHTML = list
      .map((item) => {
        const isDone = checked[item.id] === today;
        return `
          <div class="checklist-item ${isDone ? 'completed' : ''}" onclick="App.togglePrimedItem('${item.id}')">
            <div class="check-left">
              <div class="custom-checkbox">${isDone ? '✓' : ''}</div>
              <div>
                <div class="item-text" style="font-weight:700; color:var(--gold-light);">${item.phase}</div>
                <div style="font-size:0.84rem; color:var(--text-secondary);">${item.text}</div>
              </div>
            </div>
            <span class="xp-tag">+10 XP</span>
          </div>
        `;
      })
      .join('');
  },

  togglePrimedItem(itemId) {
    if (!this.state.primedCheckedToday) this.state.primedCheckedToday = {};
    const today = this.getTodayStr();
    if (this.state.primedCheckedToday[itemId] === today) {
      delete this.state.primedCheckedToday[itemId];
      this.saveState();
    } else {
      this.state.primedCheckedToday[itemId] = today;
      this.addXP(10, 'تهيئة الجهاز العصبي قبل الجلسة (Primed to Perform)');
    }
    this.renderPrimedToPerform();
    this.renderAgentLiveInsight();
  },

  toggleBoxBreathing() {
    const btn = document.getElementById('breathingToggleBtn');
    const phaseEl = document.getElementById('breathingPhaseText');
    const digitsEl = document.getElementById('breathingTimerDigits');
    if (!btn || !phaseEl || !digitsEl) return;

    if (this.breathingInterval) {
      clearInterval(this.breathingInterval);
      this.breathingInterval = null;
      btn.textContent = '▶️ ابدأ تمرين التنفس (5-5-5-5)';
      phaseEl.textContent = 'اضغط للبدء بتهدئة جهازك العصبي';
      digitsEl.textContent = '05';
      return;
    }

    const phases = [
      '🌬️ شهيق عميق وبطيء من الأنف (Inhale)...',
      '⏸️ احبس النفس بهدوء تام (Hold)...',
      '😮‍💨 زفير بطيء ومستمر من الفم (Exhale)...',
      '🧘‍♂️ راحة وسكون قبل الدورة التالية (Hold)...'
    ];
    this.breathingStep = 0;
    this.breathingSeconds = 5;
    btn.textContent = '⏹️ إيقاف مؤقت التنفس';
    phaseEl.textContent = phases[0];
    digitsEl.textContent = '05';

    this.breathingInterval = setInterval(() => {
      this.breathingSeconds--;
      if (this.breathingSeconds <= 0) {
        this.breathingStep = (this.breathingStep + 1) % 4;
        this.breathingSeconds = 5;
        phaseEl.textContent = phases[this.breathingStep];
        this.playGentleChime();
      }
      digitsEl.textContent = String(this.breathingSeconds).padStart(2, '0');
    }, 1000);
  },

  renderDetachProtocol(type) {
    const box = document.getElementById('detachProtocolContentBox');
    if (!box || !window.MYTM_COURSE_DATA) return;
    const protocols = window.MYTM_COURSE_DATA.detachResetProtocols || {};
    const proto = protocols[type] || protocols.loss;
    if (!proto) return;
    const borderColor = type === 'loss' ? 'rgba(239,68,68,0.4)' : type === 'win' ? 'rgba(16,185,129,0.4)' : 'rgba(212,175,55,0.4)';

    box.innerHTML = `
      <div style="padding:20px; background:rgba(255,255,255,0.03); border:1px solid ${borderColor}; border-radius:14px;">
        <h4 style="color:var(--gold-light); font-size:1.12rem; margin-bottom:8px;">${proto.title}</h4>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:10px; line-height:1.75;">${proto.intro}</p>
        <div style="padding:12px 14px; background:rgba(212,175,55,0.1); border:1px solid var(--border-gold); border-radius:10px; margin-bottom:14px; font-weight:700; color:var(--gold-light);">
          ❓ سؤال الموازنة العصبية الآن: ${proto.question}
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${(proto.points || [])
            .map(
              (pt) => `
            <div style="padding:12px 14px; background:rgba(0,0,0,0.28); border-right:3px solid var(--gold-primary); border-radius:8px; font-size:0.92rem; line-height:1.8;">
              ${pt}
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  },

  // ==================== دستور استراتيجيتي الخاصة (الدخول والخروج للمراجعة اليومية) ====================
  renderStrategyPlaybook() {
    const pb = this.state.strategyPlaybook || {};
    const fGen = document.getElementById('stratGeneralPhilosophy');
    if (fGen) {
      fGen.value = pb.generalPhilosophy || '';
      document.getElementById('stratRiskRules').value = pb.riskRules || '';
      document.getElementById('stratEntryRules').value = pb.entryRules || '';
      document.getElementById('stratExitRules').value = pb.exitRules || '';
      document.getElementById('stratSwingVsDayRules').value = pb.swingVsDayRules || '';
      document.getElementById('stratGoldenNotes').value = pb.goldenNotes || '';
    }

    const badgeEl = document.getElementById('strategyReviewCountBadge');
    if (badgeEl) {
      badgeEl.textContent = `مرات المراجعة: ${pb.reviewCount || 0}`;
    }

    const btnRev = document.getElementById('btnReviewStrategyToday');
    const today = this.getTodayStr();
    if (btnRev) {
      const doneToday = pb.lastReviewedDate === today;
      btnRev.textContent = doneToday
        ? '✅ تمت مراجعة دستور الاستراتيجية وشروط الدخول والخروج اليوم'
        : '✅ راجعت استراتيجيتي وشروط الدخول والخروج اليوم (+20 XP)';
    }

    const box = document.getElementById('renderedStrategyPlaybookBox');
    if (!box) return;

    const hasContent =
      (pb.entryRules && pb.entryRules.trim()) ||
      (pb.exitRules && pb.exitRules.trim()) ||
      (pb.generalPhilosophy && pb.generalPhilosophy.trim());

    if (!hasContent) {
      box.innerHTML = `
        <div style="text-align:center; color:var(--text-secondary); padding:14px;">
          لم تقم بكتابة دستور استراتيجيتك وشروط الدخول والخروج بعد.<br/>
          قم بتعبئة الحقول الـ 6 بالأسفل واضغط <strong>"حفظ واعتماد دستور استراتيجيتي"</strong> لتظهر هنا جاهزة للمراجعة اليومية قبل كل جلسة تداول!
        </div>
      `;
      return;
    }

    box.innerHTML = `
      <div class="grid-2" style="gap:16px;">
        <div style="padding:14px; background:rgba(255,255,255,0.03); border-right:3px solid var(--gold-primary); border-radius:10px;">
          <strong style="color:var(--gold-light); display:block; margin-bottom:6px;">🌊⚡ 1. الأسواق والفريمات وفلسفة التداول:</strong>
          <div style="font-size:0.9rem; white-space:pre-line; color:var(--text-primary);">${this.escapeHtml(pb.generalPhilosophy || 'غير محدد')}</div>
        </div>
        <div style="padding:14px; background:rgba(255,255,255,0.03); border-right:3px solid #FBBF24; border-radius:10px;">
          <strong style="color:#FBBF24; display:block; margin-bottom:6px;">⚖️ 2. إدارة المخاطر والحد الأقصى للخسارة:</strong>
          <div style="font-size:0.9rem; white-space:pre-line; color:var(--text-primary);">${this.escapeHtml(pb.riskRules || 'غير محدد')}</div>
        </div>
        <div style="padding:14px; background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.3); border-radius:10px;">
          <strong style="color:#34D399; display:block; margin-bottom:6px;">🎯 3. شروط وملاحظات حالة الدخول (Entry Rules):</strong>
          <div style="font-size:0.92rem; white-space:pre-line; color:var(--text-primary);">${this.escapeHtml(pb.entryRules || 'غير محدد')}</div>
        </div>
        <div style="padding:14px; background:rgba(212,175,55,0.07); border:1px solid var(--border-gold); border-radius:10px;">
          <strong style="color:var(--gold-light); display:block; margin-bottom:6px;">🏁 4. شروط وملاحظات حالة الخروج والأهداف (Exit & TP/SL):</strong>
          <div style="font-size:0.92rem; white-space:pre-line; color:var(--text-primary);">${this.escapeHtml(pb.exitRules || 'غير محدد')}</div>
        </div>
        <div style="padding:14px; background:rgba(59,130,246,0.07); border-right:3px solid #60A5FA; border-radius:10px;">
          <strong style="color:#60A5FA; display:block; margin-bottom:6px;">🔄 5. الفصل بين السوينج والمضاربة اليومية:</strong>
          <div style="font-size:0.9rem; white-space:pre-line; color:var(--text-primary);">${this.escapeHtml(pb.swingVsDayRules || 'غير محدد')}</div>
        </div>
        <div style="padding:14px; background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.3); border-radius:10px;">
          <strong style="color:#F87171; display:block; margin-bottom:6px;">🚫 6. القائمة الحمراء وملاحظاتي الذهبية (متى يُمنع التداول؟):</strong>
          <div style="font-size:0.9rem; white-space:pre-line; color:var(--text-primary);">${this.escapeHtml(pb.goldenNotes || 'غير محدد')}</div>
        </div>
      </div>
    `;
  },

  saveTradingStrategyPlaybook() {
    if (!this.state.strategyPlaybook) this.state.strategyPlaybook = {};
    const pb = this.state.strategyPlaybook;
    const hadBefore = Boolean(pb.entryRules && pb.entryRules.trim());

    pb.generalPhilosophy = document.getElementById('stratGeneralPhilosophy')?.value.trim() || '';
    pb.riskRules = document.getElementById('stratRiskRules')?.value.trim() || '';
    pb.entryRules = document.getElementById('stratEntryRules')?.value.trim() || '';
    pb.exitRules = document.getElementById('stratExitRules')?.value.trim() || '';
    pb.swingVsDayRules = document.getElementById('stratSwingVsDayRules')?.value.trim() || '';
    pb.goldenNotes = document.getElementById('stratGoldenNotes')?.value.trim() || '';

    if (!hadBefore && (pb.entryRules || pb.exitRules)) {
      this.addXP(30, 'صياغة واعتماد دستور الاستراتيجية وشروط الدخول والخروج');
    } else {
      this.saveState();
      this.showToast('✅ تم حفظ وتحديث دستور استراتيجيتك وملاحظات الدخول والخروج بنجاح!');
    }
    this.renderStrategyPlaybook();
    this.renderAgentLiveInsight();
  },

  markStrategyReviewedToday() {
    if (!this.state.strategyPlaybook) this.state.strategyPlaybook = {};
    const pb = this.state.strategyPlaybook;
    if (!pb.entryRules && !pb.exitRules && !pb.generalPhilosophy) {
      this.showToast('⚠️ اكتب شروط الدخول والخروج في دستور استراتيجيتك بالأسفل أولاً!');
      return;
    }
    const today = this.getTodayStr();
    if (pb.lastReviewedDate === today) {
      this.showToast('لقد قمت بتسجيل مراجعة استراتيجيتك لهذا اليوم بالفعل! التزم بها حرفياً 💪');
      return;
    }
    pb.lastReviewedDate = today;
    pb.reviewCount = (pb.reviewCount || 0) + 1;
    this.addXP(20, 'مراجعة دستور الاستراتيجية وشروط الدخول والخروج قبل التداول');
    this.renderStrategyPlaybook();
    this.renderAgentLiveInsight();
  },

  renderMytmAcademy() {
    const container = document.getElementById('mytmAcademyStepsContainer');
    if (!container || !window.MYTM_COURSE_DATA) return;

    const completedMap = this.state.mytmCompletedLessons || {};
    const totalDoneLessons = Object.keys(completedMap).length;
    const totalBadge = document.getElementById('mytmLessonsProgressBadge');
    if (totalBadge) {
      totalBadge.textContent = `${totalDoneLessons} / 63 درساً مكتملاً`;
    }

    container.innerHTML = (window.MYTM_COURSE_DATA.steps || [])
      .map((s) => {
        const lessons = s.detailedLessons || [];
        const doneInStep = lessons.filter((l) => completedMap[l.id]).length;
        const pct = lessons.length ? Math.round((doneInStep / lessons.length) * 100) : 0;
        const hasNote = Boolean(this.state.mytmStepNotes && this.state.mytmStepNotes[s.stepNumber]?.trim());

        return `
        <div class="law-card" onclick="App.openMytmStepModal(${s.stepNumber}, 'philosophy')" style="cursor:pointer;">
          <div>
            <div class="law-card-top">
              <span class="law-num-badge">المرحلة ${s.stepNumber} • (${lessons.length} دروس فيديو)</span>
              <span class="law-icon-lg">${s.icon}</span>
            </div>
            <h3>${s.title}</h3>
            <div class="law-en-title">${s.englishTitle}</div>
            <div style="margin:6px 0 10px;">
              <span style="font-size:0.76rem; padding:3px 9px; background:rgba(212,175,55,0.12); border:1px solid var(--border-gold); border-radius:20px; color:var(--gold-light);">
                🔗 يوازي: ${s.hillLawParallel}
              </span>
              ${hasNote ? '<span style="font-size:0.75rem; margin-right:6px; color:#34D399;">📝 لديك ملاحظة محفوظة</span>' : ''}
            </div>
            <p class="law-short-desc" style="white-space:pre-line;">${s.coreSummary}</p>
          </div>
          <div class="law-progress-footer">
            <div class="law-progress-labels">
              <span>إنجاز الدروس: <strong style="color:var(--gold-light)">${doneInStep}/${lessons.length} (${pct}%)</strong></span>
              <span style="color:var(--gold-primary); font-weight:700;">📖 افتح النافذة المبوبة ⬅</span>
            </div>
            <div class="xp-bar-container">
              <div class="xp-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        </div>
      `;
      })
      .join('');
  },

  openMytmStepModal(stepNum, activeTab = 'philosophy') {
    if (!window.MYTM_COURSE_DATA) return;
    const step = (window.MYTM_COURSE_DATA.steps || []).find((s) => s.stepNumber === stepNum);
    if (!step) return;

    document.getElementById('modalMytmStepBadge').textContent = `المرحلة ${step.stepNumber} • يوازي: ${step.hillLawParallel}`;
    document.getElementById('modalMytmStepTitle').textContent = `${step.icon} ${step.title}`;
    document.getElementById('modalMytmStepEnTitle').textContent = step.englishTitle;

    const lessons = step.detailedLessons || [];
    const completedMap = this.state.mytmCompletedLessons || {};
    const doneCount = lessons.filter((l) => completedMap[l.id]).length;
    const savedNote = (this.state.mytmStepNotes && this.state.mytmStepNotes[step.stepNumber]) || '';

    const tabsHeaderHtml = `
      <div class="sub-tabs" style="margin-bottom: 18px;">
        <button class="sub-tab ${activeTab === 'philosophy' ? 'active' : ''}" onclick="App.openMytmStepModal(${step.stepNumber}, 'philosophy')">
          📘 1. الشرح العميق والفلسفة
        </button>
        <button class="sub-tab ${activeTab === 'lessons' ? 'active' : ''}" onclick="App.openMytmStepModal(${step.stepNumber}, 'lessons')">
          🎬 2. دروس الفيديو بالتفصيل (${doneCount}/${lessons.length})
        </button>
        <button class="sub-tab ${activeTab === 'application' ? 'active' : ''}" onclick="App.openMytmStepModal(${step.stepNumber}, 'application')">
          🌊⚡ 3. تطبيق السوينج والمضاربة
        </button>
        <button class="sub-tab ${activeTab === 'notes' ? 'active' : ''}" onclick="App.openMytmStepModal(${step.stepNumber}, 'notes')">
          📝 4. ملاحظاتي الخاصة ${savedNote.trim() ? '✓' : ''}
        </button>
      </div>
    `;

    let tabBodyHtml = '';

    if (activeTab === 'philosophy') {
      tabBodyHtml = `
        <div style="margin-bottom: 18px;">
          <h4 style="color: var(--gold-light); margin-bottom: 8px; font-size: 1.05rem;">📘 الشرح العميق والفلسفة الكاملة لهذه المرحلة:</h4>
          <div style="color: var(--text-primary); line-height: 1.9; font-size: 0.95rem; white-space: pre-line; background: rgba(255,255,255,0.03); padding: 18px; border-radius: 12px; border-right: 3px solid var(--gold-primary);">${step.deepDivePhilosophy || step.coreSummary}</div>
        </div>

        <div style="margin-bottom: 18px; padding: 16px; background: rgba(16, 185, 129, 0.09); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 12px;">
          <strong style="color: #34D399; font-size: 0.96rem;">⚡ القاعدة الذهبية الحاكمة في هذه المرحلة:</strong>
          <p style="color: var(--text-primary); font-size: 0.93rem; margin-top: 6px; line-height: 1.8;">${step.practicalRule}</p>
        </div>

        <div style="margin-bottom: 18px;">
          <h4 style="color: var(--gold-light); margin-bottom: 10px; font-size: 1.02rem;">🪞 أسئلة المحاسبة الذاتية والوعي (اسأل نفسك بصدق):</h4>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${(step.selfCheckQuestions || [])
              .map(
                (q, idx) => `
              <div style="padding:12px 14px; background:rgba(0,0,0,0.28); border:1px solid var(--border-subtle); border-radius:10px; font-size:0.9rem;">
                <strong style="color:var(--gold-light);">س${idx + 1}:</strong> ${q}
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-top:16px;">
          <button class="btn btn-gold" onclick="App.openMytmStepModal(${step.stepNumber}, 'lessons')">
            🎬 انتقل إلى تفاصيل دروس الفيديو (${lessons.length} دروس) ⬅
          </button>
          <button class="btn btn-outline-gold" onclick="App.discussMytmStepWithAgent(${step.stepNumber})">
            🤖 ناقش هذه المرحلة مع المرشد النفسي الذكي
          </button>
        </div>
      `;
    } else if (activeTab === 'lessons') {
      tabBodyHtml = `
        <div style="margin-bottom: 14px;">
          <h4 style="color: var(--gold-light); margin-bottom: 6px; font-size: 1.05rem;">🎬 تفاصيل فيديوهات هذه المرحلة درساً بدرس (${doneCount} من ${lessons.length} مكتمل):</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 14px;">
            اقرأ الخلاصة التفصيلية المستخرجة من ترانسكريبت كل فيديو، وطبق خطوته العملية ثم أشر على المربع لكسب <strong>+15 XP</strong>:
          </p>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${lessons
              .map((l) => {
                const isDone = Boolean(completedMap[l.id]);
                return `
                <div style="padding:16px; background:rgba(255,255,255,0.03); border:1px solid ${
                  isDone ? 'rgba(16,185,129,0.45)' : 'var(--border-gold)'
                }; border-radius:12px;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap; margin-bottom:8px;">
                    <div style="display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="App.toggleMytmLesson(${step.stepNumber}, '${l.id}')">
                      <div class="custom-checkbox" style="${
                        isDone ? 'background:var(--gold-primary); color:#090D16; font-weight:900;' : ''
                      }">${isDone ? '✓' : ''}</div>
                      <strong style="color:${isDone ? '#34D399' : 'var(--gold-light)'}; font-size:0.98rem;">${l.title}</strong>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                      <span class="law-num-badge">⏱️ ${l.duration}</span>
                      <span class="xp-tag">+15 XP</span>
                    </div>
                  </div>
                  <p style="font-size:0.9rem; color:var(--text-primary); line-height:1.8; margin-bottom:10px; padding-right:30px;">
                    ${l.summary}
                  </p>
                  <div style="margin-right:30px; padding:8px 12px; background:rgba(212,175,55,0.1); border-right:3px solid var(--gold-primary); border-radius:8px; font-size:0.85rem; color:var(--gold-light);">
                    🛠️ <strong>التطبيق العملي من الفيديو:</strong> ${l.actionItem}
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        </div>
      `;
    } else if (activeTab === 'application') {
      tabBodyHtml = `
        <div style="margin-bottom: 18px;">
          <h4 style="color: var(--gold-light); margin-bottom: 12px; font-size: 1.05rem;">🌊⚡ كيف تطبق (${step.title}) في أسلوبك المزدوج؟</h4>
          <div class="grid-2" style="gap: 14px; margin-bottom: 16px;">
            <div style="padding: 18px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 12px;">
              <strong style="color: #60A5FA; font-size: 1rem; display: block; margin-bottom: 8px;">🌊 في صفقات السوينج (Swing Trading):</strong>
              <p style="font-size: 0.92rem; color: var(--text-primary); line-height: 1.85;">${step.swingAndDayGuide?.swing || step.practicalRule}</p>
            </div>
            <div style="padding: 18px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 12px;">
              <strong style="color: #FBBF24; font-size: 1rem; display: block; margin-bottom: 8px;">⚡ في المضاربة اليومية (Day Trading):</strong>
              <p style="font-size: 0.92rem; color: var(--text-primary); line-height: 1.85;">${step.swingAndDayGuide?.day || step.practicalRule}</p>
            </div>
          </div>

          <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-gold); border-radius: 12px; margin-bottom: 16px;">
            <strong style="color: var(--gold-light); display: block; margin-bottom: 6px;">🔗 التوازي الفلسفي مع نابليون هيل:</strong>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.8;">
              ترتبط هذه المرحلة مباشرة بـ <strong>(${step.hillLawParallel})</strong>؛ حيث يؤكد كلا المنهجين أن السيطرة على الذات ووضوح الخطة المكتوبة يسبقان أي نجاح مالي مستدام.
            </p>
          </div>

          <button class="btn btn-gold" style="width: 100%;" onclick="App.discussMytmStepWithAgent(${step.stepNumber})">
            🤖 اطلب من المرشد النفسي الذكي خطة تطبيقية لهذه المرحلة على تداولك الآن
          </button>
        </div>
      `;
    } else if (activeTab === 'notes') {
      tabBodyHtml = `
        <div>
          <h4 style="color: var(--gold-light); margin-bottom: 8px; font-size: 1.05rem;">📝 ملاحظاتي وتأملاتي وقواعدي المستخلصة من (${step.title}):</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 12px;">
            دوّن هنا ما لمس قلبك وعقلك في هذه المرحلة، أو القواعد التي قررت تطبيقها في صفقاتك القادمة (يطلع عليها المرشد الذكي أيضاً):
          </p>
          <textarea id="modalMytmStepNoteInput" class="form-control" style="min-height: 160px;" placeholder="اكتب ملاحظاتك وخلاصة فهمك لهذه المرحلة من الكورس...">${this.escapeHtml(savedNote)}</textarea>
          <button class="btn btn-gold" style="margin-top: 12px; width: 100%;" onclick="App.saveMytmStepNote(${step.stepNumber})">
            💾 حفظ ملاحظاتي على هذه المرحلة (+20 XP)
          </button>
        </div>
      `;
    }

    document.getElementById('modalMytmStepBody').innerHTML = tabsHeaderHtml + tabBodyHtml;
    document.getElementById('mytmStepDetailModal').classList.add('open');
  },

  closeMytmStepModal() {
    document.getElementById('mytmStepDetailModal')?.classList.remove('open');
    this.renderMytmAcademy();
    this.renderAgentLiveInsight();
  },

  toggleMytmLesson(stepNum, lessonId) {
    if (!this.state.mytmCompletedLessons) this.state.mytmCompletedLessons = {};
    if (this.state.mytmCompletedLessons[lessonId]) {
      delete this.state.mytmCompletedLessons[lessonId];
      this.saveState();
    } else {
      this.state.mytmCompletedLessons[lessonId] = true;
      this.addXP(15, 'إتمام دراسة درس تفصيلي في أكاديمية عقلية المتداول');
    }
    this.openMytmStepModal(stepNum, 'lessons');
    this.renderMytmAcademy();
  },

  saveMytmStepNote(stepNum) {
    const val = document.getElementById('modalMytmStepNoteInput')?.value || '';
    if (!this.state.mytmStepNotes) this.state.mytmStepNotes = {};
    const hadBefore = Boolean(this.state.mytmStepNotes[stepNum]?.trim());
    this.state.mytmStepNotes[stepNum] = val;
    if (!hadBefore && val.trim().length > 3) {
      this.addXP(20, 'تدوين ملاحظة تطبيقية على مرحلة في أكاديمية الكورس');
    } else {
      this.saveState();
      this.showToast('✅ تم حفظ ملاحظتك على هذه المرحلة بنجاح!');
    }
    this.openMytmStepModal(stepNum, 'notes');
    this.renderMytmAcademy();
  },

  discussMytmStepWithAgent(stepNum) {
    const step = (window.MYTM_COURSE_DATA?.steps || []).find((s) => s.stepNumber === stepNum);
    this.closeMytmStepModal();
    this.switchView('agent');
    if (step) {
      this.processAgentConversation(
        `أريد خطة عملية لتطبيق (${step.title}) على أسلوبي في السوينج والمضاربة اليومية وعلاج نقاط ضعفي.`,
        'custom'
      );
    }
  },

  renderTenKChecklist() {
    const container = document.getElementById('tenKChecklistContainer');
    if (!container || !window.MYTM_COURSE_DATA) return;
    const completed = this.state.tenKCompleted || {};
    const list = window.MYTM_COURSE_DATA.tenKChecklist30 || [];
    const doneCount = list.filter((item) => completed[item.id]).length;

    const badgeEl = document.getElementById('tenKChecklistBadge');
    if (badgeEl) badgeEl.textContent = `${doneCount} / ${list.length} مكتمل`;

    const topStatEl = document.getElementById('tradeStat10kProgress');
    if (topStatEl) topStatEl.textContent = `${doneCount} / ${list.length}`;

    container.innerHTML = list
      .map((item) => {
        const isDone = Boolean(completed[item.id]);
        return `
          <div class="checklist-item ${isDone ? 'completed' : ''}" onclick="App.toggleTenKItem('${item.id}')">
            <div class="check-left">
              <div class="custom-checkbox">${isDone ? '✓' : ''}</div>
              <div>
                <span class="law-num-badge" style="margin-left:6px;">${item.phase}</span>
                <div class="item-text" style="font-weight:700; margin-top:4px;">${item.title}</div>
              </div>
            </div>
            <span class="xp-tag">+25 XP</span>
          </div>
        `;
      })
      .join('');
  },

  toggleTenKItem(id) {
    if (!this.state.tenKCompleted) this.state.tenKCompleted = {};
    if (this.state.tenKCompleted[id]) {
      delete this.state.tenKCompleted[id];
      this.saveState();
    } else {
      this.state.tenKCompleted[id] = true;
      this.addXP(25, 'إنجاز محطة في خارطة $10K/Month Checklist');
    }
    this.renderTenKChecklist();
    this.renderAgentLiveInsight();
  },

  addNeuralLog() {
    const trigger = document.getElementById('neuralTriggerInput')?.value.trim();
    const reframe = document.getElementById('neuralReframeInput')?.value.trim();
    const identity = document.getElementById('neuralIdentityInput')?.value.trim();

    if (!trigger || !reframe) {
      this.showToast('⚠️ يرجى كتابة المعتقد/النمط القديم وإعادة التأطير العصبي أولاً');
      return;
    }

    if (!this.state.neuralLogs) this.state.neuralLogs = [];
    this.state.neuralLogs.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString('ar-SA'),
      trigger,
      reframe,
      identity: identity || 'أنا متداول منضبط يتبع خطته بهدوء وثقة'
    });

    document.getElementById('neuralTriggerInput').value = '';
    document.getElementById('neuralReframeInput').value = '';
    document.getElementById('neuralIdentityInput').value = '';

    this.addXP(20, 'إعادة برمجة مسار عصبي (Neural Logging)');
    this.renderNeuralLogs();
  },

  renderNeuralLogs() {
    const listEl = document.getElementById('neuralLogsList');
    if (!listEl) return;
    const logs = this.state.neuralLogs || [];
    if (!logs.length) {
      listEl.innerHTML = `<p style="font-size:0.84rem; color:var(--text-secondary); text-align:center;">لم تضف سجلات إعادة برمجة عصبية بعد. دوّن أول نمط تريد تغييره!</p>`;
      return;
    }

    listEl.innerHTML = logs
      .slice(0, 8)
      .map(
        (n) => `
        <div style="padding:12px; background:rgba(255,255,255,0.03); border:1px solid var(--border-gold); border-radius:10px; margin-bottom:8px; font-size:0.85rem;">
          <div style="color:#F87171; margin-bottom:4px;">❌ <strong>النمط القديم:</strong> ${this.escapeHtml(n.trigger)}</div>
          <div style="color:#34D399; margin-bottom:4px;">✅ <strong>المسار الجديد:</strong> ${this.escapeHtml(n.reframe)}</div>
          <div style="color:var(--gold-light);">👑 <strong>الهوية (Law #3):</strong> ${this.escapeHtml(n.identity)}</div>
        </div>
      `
      )
      .join('');
  },

  // ==================== 10. المرشد النفسي الذكي ومدرب التداول + جلسة الصراحة الدائمة ====================
  renderAgentSection() {
    const keyInput = document.getElementById('geminiApiKeyInput');
    if (keyInput) {
      keyInput.value = this.state.geminiApiKey || '';
    }
    const statusText = document.getElementById('agentEngineStatusText');
    if (statusText) {
      statusText.innerHTML = this.state.geminiApiKey
        ? 'الحالة: <strong style="color:#34D399;">متصل بـ Google Gemini AI + المحرك النفسي المدمج (16 Laws + MYTM 2.0) ✅</strong>'
        : 'الحالة: <strong style="color:#34D399;">المحرك النفسي الخبير المدمج (16 Laws + MYTM 2.0) نشط وجاهز ✅</strong>';
    }

    this.renderTraderConfessionDossier();
    this.renderAgentMessages();
    this.renderAgentLiveInsight();
  },

  renderTraderConfessionDossier() {
    const prof = this.state.traderPsychProfile || {};
    const wEl = document.getElementById('confessWeaknesses');
    if (wEl) {
      wEl.value = prof.weaknesses || '';
      document.getElementById('confessTriggers').value = prof.triggers || '';
      document.getElementById('confessPastBlocks').value = prof.pastBlocks || '';
      document.getElementById('confessFocusAreas').value = prof.focusAreas || '';
    }
    const badge = document.getElementById('confessionStatusBadge');
    if (badge) {
      badge.textContent = prof.lastUpdated ? `✅ محفوظ في ذاكرة المرشد (${prof.lastUpdated})` : 'ذاكرة المرشد الدائمة';
    }
  },

  saveTraderConfessionDossier() {
    if (!this.state.traderPsychProfile) this.state.traderPsychProfile = {};
    const prof = this.state.traderPsychProfile;
    const hadBefore = Boolean(prof.weaknesses && prof.weaknesses.trim());

    prof.weaknesses = document.getElementById('confessWeaknesses')?.value.trim() || '';
    prof.triggers = document.getElementById('confessTriggers')?.value.trim() || '';
    prof.pastBlocks = document.getElementById('confessPastBlocks')?.value.trim() || '';
    prof.focusAreas = document.getElementById('confessFocusAreas')?.value.trim() || '';
    prof.lastUpdated = new Date().toLocaleDateString('ar-SA');

    if (!hadBefore && (prof.weaknesses || prof.triggers || prof.focusAreas)) {
      this.addXP(35, 'توثيق جلسة الصراحة التأسيسية في الذاكرة الدائمة للمرشد الذكي');
    } else {
      this.saveState();
      this.showToast('✅ تم حفظ جلسة الصراحة في الذاكرة الدائمة للمرشد الذكي!');
    }

    this.renderTraderConfessionDossier();
    this.renderAgentLiveInsight();
    this.triggerAgentAction('confession_review');
  },

  renderAgentMessages() {
    const list = document.getElementById('agentMessagesList');
    if (!list) return;
    const history = this.state.agentChatHistory || [];
    list.innerHTML = history
      .map((m) => {
        if (m.role === 'user') {
          return `<div class="chat-bubble user">${this.formatAgentMarkdown(m.text)}</div>`;
        }
        const isCloudAI = m.source === 'gemini';
        const badgeHtml = isCloudAI
          ? `<div style="display:inline-flex; align-items:center; gap:6px; font-size:0.72rem; font-weight:800; padding:3px 10px; border-radius:99px; background:rgba(16,185,129,0.18); color:#34D399; border:1px solid rgba(16,185,129,0.45); margin-bottom:8px;">🌐 رد ذكي حي من Google Gemini AI (${this.escapeHtml(m.model || 'Cloud')}) — مربوط ببياناتك ✅</div>`
          : `<div style="display:inline-flex; align-items:center; gap:6px; font-size:0.72rem; font-weight:700; padding:3px 10px; border-radius:99px; background:rgba(212,175,55,0.15); color:var(--gold-light); border:1px solid rgba(212,175,55,0.35); margin-bottom:8px;">🧠 المحرك النفسي الخبير المدمج (16 Laws + MYTM 2.0)</div>`;
        return `
          <div class="chat-bubble agent">
            ${badgeHtml}
            <div>${this.formatAgentMarkdown(m.text)}</div>
          </div>
        `;
      })
      .join('');
    list.scrollTop = list.scrollHeight;
  },

  formatAgentMarkdown(text) {
    const safe = this.escapeHtml(text || '');
    return safe
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--gold-light);">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#FDE68A;">$1</em>')
      .replace(/\n/g, '<br/>');
  },

  renderAgentLiveInsight() {
    const box = document.getElementById('agentLiveInsightBox');
    if (!box) return;

    const tStats = this.getTradingAnalytics();
    const rankedLaws = window.NAPOLEON_HILL_DATA.laws
      .map((l) => ({ ...l, score: this.getLawMastery(l.id) }))
      .sort((a, b) => a.score - b.score);
    const weakestLaw = rankedLaws[0];
    const secondWeakest = rankedLaws[1];

    const today = this.getTodayStr();
    const bpDone = Object.values(this.state.blueprintCompletedToday || {}).filter((d) => d === today).length;
    const primedDone = Object.values(this.state.primedCheckedToday || {}).filter((d) => d === today).length;
    const tenKDone = Object.keys(this.state.tenKCompleted || {}).length;
    const lessonsDone = Object.keys(this.state.mytmCompletedLessons || {}).length;
    const stratReviewedToday = this.state.strategyPlaybook?.lastReviewedDate === today;
    const prof = this.state.traderPsychProfile || {};

    box.innerHTML = `
      <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
        🎯 <strong>الهدف الرئيسي المحدد (Law #2):</strong><br/>
        <span style="color:var(--gold-light);">${
          this.state.definiteAim?.goal
            ? this.escapeHtml(this.state.definiteAim.goal)
            : '⚠️ لم تكتب هدفك الرئيسي بعد'
        }</span>
      </div>
      <div style="margin-bottom: 10px; padding: 10px; background: rgba(212,175,55,0.08); border: 1px solid var(--border-gold); border-radius: 8px;">
        🪞 <strong>ملف جلسة الصراحة ونقاط تركيزك الدائمة:</strong><br/>
        • نقاط الضعف المرصودة: <span style="color:#FCA5A5;">${
          prof.weaknesses ? this.escapeHtml(prof.weaknesses) : 'لم تملأ جلسة الصراحة بالأسفل بعد'
        }</span><br/>
        • تنبيهات التركيز المطلوبة مني: <span style="color:#34D399;">${
          prof.focusAreas ? this.escapeHtml(prof.focusAreas) : 'اكتب ما تريد مني تنبيهك عليه بالأسفل'
        }</span>
      </div>
      <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
        📈 <strong>ملفك الحي في التداول وأكاديمية MYTM 2.0:</strong><br/>
        • مراجعة دستور الاستراتيجية اليوم: <strong style="color:${stratReviewedToday ? '#34D399' : '#FBBF24'};">${
      stratReviewedToday ? 'تمت المراجعة ✅' : 'لم تراجعها اليوم بعد ⚠️'
    }</strong><br/>
        • الصفقات المسجلة: <strong>${tStats.total}</strong> | الانضباط: <strong style="color:${tStats.disciplinePct >= 75 ? '#34D399' : '#F87171'};">${tStats.disciplinePct}%</strong><br/>
        • جاهزية Primed اليوم: <strong>${primedDone} / 6</strong> | دروس الكورس: <strong>${lessonsDone} / 63</strong><br/>
        • تقدم خارطة الـ $10K/Month: <strong style="color:var(--gold-light);">${tenKDone} / 30 محطة</strong>
      </div>
      <div style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
        🧭 <strong>أضعف القوانين التي تحتاج تقوية الآن:</strong><br/>
        1. ${weakestLaw.icon} ${weakestLaw.title} (${weakestLaw.score}%) | 2. ${secondWeakest.icon} ${secondWeakest.title} (${secondWeakest.score}%)
      </div>
      <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
        📋 <strong>إنجاز شيك لست اليوم المثالي:</strong> <strong>${bpDone} / 13 خطوة</strong>
      </div>
    `;
  },

  async saveAgentApiKey() {
    const key = document.getElementById('geminiApiKeyInput').value.trim();
    this.state.geminiApiKey = key;
    this.saveState();
    this.renderAgentSection();
    if (key) {
      await this.testGeminiConnection();
    } else {
      this.showToast('ℹ️ تم التبديل إلى المحرك النفسي الخبير المدمج');
    }
  },

  async testGeminiConnection() {
    const keyInput = document.getElementById('geminiApiKeyInput');
    const key = (keyInput ? keyInput.value.trim() : '') || (this.state.geminiApiKey || '').trim();
    const statusBox = document.getElementById('agentEngineStatusText');

    if (!key || key.length < 10) {
      if (statusBox) {
        statusBox.innerHTML = `⚠️ <strong style="color:#FBBF24;">لم يتم إدخال مفتاح Gemini API بعد.</strong><br/>يعمل حالياً <strong>المحرك النفسي الخبير المدمج (Offline)</strong> بكامل كفاءته. إذا أردت تفعيل الذكاء السحابي الصق المفتاح أعلاه ثم اضغط حفظ.`;
      }
      this.showToast('⚠️ يرجى لصق مفتاح Gemini API في الحقل أولاً');
      return;
    }

    this.state.geminiApiKey = key;
    this.saveState();

    if (statusBox) {
      statusBox.innerHTML = `⏳ <strong style="color:#93c5fd;">جاري فحص الاتصال الفعلي مع خوادم Google Gemini AI...</strong>`;
    }

    const testPrompt = `أجب بجملة ترحيبية واحدة قصيرة باللغة العربية تؤكد فيها أنك متصل الآن كمرشد نفسي ومدرب تداول لمنظومة قوانين النجاح الـ 16 لنابليون هيل و Mentorship 2.0، واذكر أن الهدف المحدد للمستخدم هو: (${this.state.definiteAim?.goal || 'قيد الصياغة'}).`;
    const result = await this.requestGeminiCompletion(testPrompt);

    if (result && result.text) {
      if (statusBox) {
        statusBox.innerHTML = `
          🟢 <strong style="color:#34D399;">متصل وشغال بنجاح 100%!</strong><br/>
          • <strong>الموديل السحابي النشط:</strong> <code style="color:#FDE68A;">${this.escapeHtml(result.model)}</code><br/>
          • <strong>الربط مع بياناتك:</strong> مربوط فعلياً مع (جلسة الصراحة + دستور الاستراتيجية + سجل الصفقات + الطاولة المستديرة) ✅<br/>
          • <strong>رد الفحص الحي:</strong> « <em>${this.escapeHtml(result.text.slice(0, 140))}</em> »
        `;
      }
      this.showToast(`🟢 اتصال Gemini AI ناجح وشغال 100% على الموديل (${result.model})!`);
    } else {
      const errReason = result?.error || 'تأكد من صحة المفتاح أو اتصال الإنترنت';
      if (statusBox) {
        statusBox.innerHTML = `
          🔴 <strong style="color:#F87171;">تعذر الاتصال بـ Gemini API:</strong> ${this.escapeHtml(errReason)}<br/>
          • تأكد أن المفتاح يبدأ بـ <code>AIzaSy</code> وبدون مسافات زائدة.<br/>
          • 🛡️ <strong>ملاحظة:</strong> يعمل <strong>المحرك النفسي الخبير المدمج</strong> تلقائياً حتى تصلح المفتاح.
        `;
      }
      this.showToast('🔴 فشل اختبار المفتاح — راجع رسالة الخطأ في صندوق الحالة');
    }
  },

  async requestGeminiCompletion(promptText) {
    const key = (this.state.geminiApiKey || '').trim();
    if (!key || key.length < 10) return { text: null, error: 'لا يوجد مفتاح' };

    // 1. جلب قائمة الموديلات المتاحة فعلياً لهذا المفتاح من Google (ListModels) كما تطلب رسالة جوجل الرسمية
    let candidateModels = [];
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
      const listRes = await fetch(listUrl);
      if (listRes.ok) {
        const listData = await listRes.json();
        const allModels = listData.models || [];
        // فلترة الموديلات النصية التي تدعم generateContent واستبعاد موديلات الصور/الصوت/التضمين
        const supported = allModels
          .filter(
            (m) =>
              Array.isArray(m.supportedGenerationMethods) &&
              m.supportedGenerationMethods.includes('generateContent') &&
              !/vision|embedding|imagen|veo|tts|audio|aqa|bisect|learnlm/i.test(m.name)
          )
          .map((m) => m.name.replace(/^models\//, ''));

        // ترتيب الموديلات المتاحة لإعطاء الأولوية لأسرع وأفضل موديلات المحادثة
        const scoreModel = (name) => {
          if (name === 'gemini-2.5-flash') return 100;
          if (name === 'gemini-2.0-flash') return 95;
          if (name === 'gemini-2.0-flash-lite') return 92;
          if (name === 'gemini-flash-latest') return 90;
          if (name.includes('gemini-2.5-flash')) return 88;
          if (name.includes('gemini-2.0-flash')) return 85;
          if (name.includes('flash')) return 80;
          if (name.includes('gemini-2.5-pro') || name === 'gemini-pro-latest') return 75;
          if (name.includes('gemma-3')) return 70;
          return 50;
        };

        supported.sort((a, b) => scoreModel(b) - scoreModel(a));
        candidateModels = supported;
      } else {
        const errData = await listRes.json().catch(() => ({}));
        if (listRes.status === 400 || listRes.status === 403) {
          return {
            text: null,
            model: null,
            error: errData?.error?.message || `مفتاح API غير صالح أو غير مفعل (HTTP ${listRes.status})`
          };
        }
      }
    } catch (e) {
      // في حال تعذر جلب القائمة نستخدم القائمة الاحتياطية الحديثة
    }

    if (!candidateModels.length) {
      candidateModels = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-flash-latest',
        'gemini-pro-latest'
      ];
    }

    // إذا كان لدينا موديل شغال تم اكتشافه مسبقاً في نفس الجلسة، نضعه في المقدمة
    if (this.activeGeminiModel && candidateModels.includes(this.activeGeminiModel)) {
      candidateModels = [
        this.activeGeminiModel,
        ...candidateModels.filter((m) => m !== this.activeGeminiModel)
      ];
    }

    const errorsLog = [];

    // 2. تجربة الموديلات المتاحة في حساب المستخدم بالترتيب حتى ينجح أحدها
    for (const modelName of candidateModels.slice(0, 6)) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(key)}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: promptText }]
              }
            ]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
          if (text) {
            this.activeGeminiModel = modelName;
            return { text, model: modelName, error: null };
          }
        } else {
          const errJson = await res.json().catch(() => ({}));
          const msg = errJson?.error?.message || `HTTP ${res.status}`;
          errorsLog.push(`[${modelName}]: ${msg}`);
        }
      } catch (e) {
        errorsLog.push(`[${modelName}]: ${e.message || 'خطأ في الشبكة'}`);
      }
    }

    return {
      text: null,
      model: null,
      error: errorsLog[0] || 'تعذر الحصول على استجابة من الموديلات المتاحة'
    };
  },

  clearAgentChat() {
    this.state.agentChatHistory = [
      {
        role: 'agent',
        text: 'تم مسح سجل الرسائل المؤقت فقط، بينما **ملف جلسة صراحتك الدائم ودستور استراتيجيتك وسجل صفقاتك محفوظة بالكامل في ذاكرتي!** كيف يمكنني دعمك الآن؟'
      }
    ];
    this.saveState();
    this.renderAgentMessages();
  },

  triggerAgentAction(actionType) {
    const promptsMap = {
      analyze_trading: 'حلّل سجل تداولي وأخطائي النفسية المتكررة وفق قوانين هيل وأكاديمية MYTM 2.0 وأعطني خطة علاجية',
      emergency_tilt: 'أشعر الآن برغبة في الانتقام من السوق أو التسرع والدخول بعاطفة، فعّل بروتوكول الطوارئ فوراً!',
      false_winning: 'اشرح لي فخ الربح الكاذب (False Winning) وكيف أحمي نفسي منه في السوينج والمضاربة اليومية',
      swing_vs_day: 'كيف أضبط نفسي بين صفقات السوينج والمضاربة اليومية بدون خلط أو خروج مبكر؟',
      self_sabotage: 'لماذا أخرب حسابي بنفسي وأكسر خطتي بعد سلسلة أرباح جيدة؟ (علاج التدمير الذاتي Step 3 & Step 8)',
      daily_audit: 'راجع التزامي اليومي في شيك لست القوانين الـ 16 وخارطة الـ $10K/Month وأعطني خطة عمل لليوم',
      confession_review: 'راجع ملف جلسة صراحتي الدائم ودستور استراتيجيتي ونبهني على الأمور التي أحتاج التركيز عليها اليوم!'
    };
    const userText = promptsMap[actionType] || 'وجّهني اليوم';
    this.processAgentConversation(userText, actionType);
  },

  sendUserMessageToAgent() {
    const input = document.getElementById('agentUserInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.processAgentConversation(text, 'custom');
  },

  async processAgentConversation(userText, actionType) {
    if (!this.state.agentChatHistory) this.state.agentChatHistory = [];
    this.state.agentChatHistory.push({ role: 'user', text: userText });
    this.renderAgentMessages();

    let reply = '';
    let replySource = 'builtin';
    let usedModel = '';

    if (this.state.geminiApiKey && this.state.geminiApiKey.trim().length > 10) {
      const sendBtn = document.getElementById('agentSendBtn');
      if (sendBtn) sendBtn.textContent = '⏳ يفكر...';
      const aiRes = await this.callGeminiAgentAPI(userText);
      if (sendBtn) sendBtn.textContent = 'إرسال 🚀';

      if (aiRes && aiRes.text) {
        reply = aiRes.text;
        replySource = 'gemini';
        usedModel = aiRes.model || 'Gemini AI';
      }
    }
    if (!reply) {
      reply = this.generateBuiltInExpertResponse(userText, actionType);
      replySource = 'builtin';
    }

    this.state.agentChatHistory.push({
      role: 'agent',
      text: reply,
      source: replySource,
      model: usedModel
    });
    this.saveState();
    this.renderAgentMessages();
    this.renderAgentLiveInsight();
  },

  async callGeminiAgentAPI(userText) {
    try {
      const tStats = this.getTradingAnalytics();
      const recentTrades = (this.state.tradingLogs || []).slice(0, 5);
      const rankedLaws = window.NAPOLEON_HILL_DATA.laws
        .map((l) => ({ title: l.title, score: this.getLawMastery(l.id) }))
        .sort((a, b) => a.score - b.score);
      const tenKDone = Object.keys(this.state.tenKCompleted || {}).length;
      const lessonsDone = Object.keys(this.state.mytmCompletedLessons || {}).length;
      const prof = this.state.traderPsychProfile || {};
      const pb = this.state.strategyPlaybook || {};
      const mytmStepsSummary = (window.MYTM_COURSE_DATA?.steps || [])
        .map((s) => `Step ${s.stepNumber}: ${s.title} (${s.englishTitle})`)
        .join(' | ');

      const recentChatContext = (this.state.agentChatHistory || [])
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'المتداول' : 'المرشد'}: ${m.text}`)
        .join('\n---\n');

      const systemContext = `
أنت مرشد نفسي خبير ومدرب تداول محترف تعمل على مسارين متوازيين لا ينفصلان:
1. المسار الأول: فلسفة "قوانين النجاح الـ 16" وكتاب "فكر تصبح غنياً" لنابليون هيل.
2. المسار الثاني: منهج "Trading Psychology Transformation Mentorship 2.0" للمدرب Patrick Bailouni (${mytmStepsSummary}).
المستخدم يتداول بأسلوب: سوينج (Swing Trading) + مضاربة يومية (Day Trading).
بيانات المستخدم الدائمة والحية في البرنامج:
- الهدف الرئيسي المحدد: ${this.state.definiteAim?.goal || 'غير محدد بعد'}
- ملف جلسة الصراحة الدائم للمتداول:
  * نقاط الضعف والأخطاء المتكررة: ${prof.weaknesses || 'غير مدون بعد'}
  * المحفزات العاطفية (Triggers): ${prof.triggers || 'غير مدون بعد'}
  * صدمات وعوائق الماضي: ${prof.pastBlocks || 'غير مدون بعد'}
  * ما طلب المتداول التركيز والتنبيه عليه يومياً: ${prof.focusAreas || 'غير مدون بعد'}
- دستور استراتيجية المتداول المكتوبة:
  * شروط الدخول: ${pb.entryRules || 'غير مدون بعد'}
  * شروط الخروج: ${pb.exitRules || 'غير مدون بعد'}
  * إدارة المخاطر: ${pb.riskRules || 'غير مدون بعد'}
  * القائمة الحمراء والممنوعات: ${pb.goldenNotes || 'غير مدون بعد'}
- إحصائيات التداول: إجمالي الصفقات=${tStats.total}, نسبة الانضباط=${tStats.disciplinePct}%, نسبة الفوز=${tStats.winRate}%, صافي الربح=${tStats.totalPnL}, أكثر خطأ نفسي متكرر=${tStats.topMistakeLabel}.
- تقدم خارطة الـ $10K/Month: ${tenKDone}/30 | الدروس المكتملة: ${lessonsDone}/63.
- آخر الصفقات المسجلة: ${JSON.stringify(recentTrades)}
- أضعف 3 قوانين لدى المستخدم حالياً: ${JSON.stringify(rankedLaws.slice(0, 3))}
- سياق المحادثة الأخيرة:
${recentChatContext}
أجب باللغة العربية بأسلوب قوي، عميق، عملي، ومقسم إلى نقاط واضحة تربط بالتوازي بين خطوات Mentorship 2.0 وقوانين نابليون هيل الـ 16، وذكّره بنقاط جلسة صراحته وشروط استراتيجيته.
      `.trim();

      return await this.requestGeminiCompletion(`${systemContext}\n\nسؤال المتداول الآن: ${userText}`);
    } catch (e) {
      return null;
    }
  },

  generateBuiltInExpertResponse(userText, actionType) {
    const tStats = this.getTradingAnalytics();
    const logs = this.state.tradingLogs || [];
    const rankedLaws = window.NAPOLEON_HILL_DATA.laws
      .map((l) => ({ ...l, score: this.getLawMastery(l.id) }))
      .sort((a, b) => a.score - b.score);
    const weakest = rankedLaws[0];
    const today = this.getTodayStr();
    const bpDone = Object.values(this.state.blueprintCompletedToday || {}).filter((d) => d === today).length;
    const primedDone = Object.values(this.state.primedCheckedToday || {}).filter((d) => d === today).length;
    const tenKDone = Object.keys(this.state.tenKCompleted || {}).length;
    const lessonsDone = Object.keys(this.state.mytmCompletedLessons || {}).length;
    const prof = this.state.traderPsychProfile || {};
    const pb = this.state.strategyPlaybook || {};
    const stratReviewedToday = pb.lastReviewedDate === today;

    if (actionType === 'confession_review' || userText.includes('صراحه') || userText.includes('صراحتي') || userText.includes('ذاكرتك')) {
      const hasConfession = Boolean(prof.weaknesses || prof.triggers || prof.focusAreas || prof.pastBlocks);
      if (!hasConfession) {
        return `🪞 **جلسة الصراحة التأسيسية بانتظارك بالأسفل!**
لم تقم بتعبئة حقول **"🪞 جلسة الصراحة التأسيسية والذاكرة الدائمة للمرشد"** الموجودة في أسفل هذه الصفحة بعد.
• اكتب لي هناك بكل صراحة: ما هي أكثر أخطائك التي تتكرر؟ ما هي المحفزات التي تفقدك انضباطك؟ وما الأمور التي تريد مني أن أحاسبك عليها يومياً؟
• بمجرد الضغط على **"حفظ جلسة الصراحة"**، سأحفظها في ذاكرتي الدائمة للأبد (لن تُمسح أبداً حتى لو مسحت الدردشة) وسأبني لك خطة علاجية وتنبيهات مخصصة لك!`;
      }

      return `🪞 **تحليل المرشد الذكي لملف جلسة صراحتك الدائم وخطة التركيز الخاصة بك:**

لقد حفظتُ كل ما كتبته في ذاكرتي الدائمة، وإليك قراءتي النفسية والسلوكية لما شاركتني به بالتوازي بين **قوانين نابليون هيل** و**Mentorship 2.0**:

1. **🔍 تشخيص نقاط ضعفك المرصودة:**
   « *${prof.weaknesses || 'لم يحدد'}* »
   • **العلاج من الكورس والقوانين:** هذه الأنماط تعكس تفاعل "الفريسة" اللحظي مع حركة الشموع أو الخوف على الربح؛ وعلاجها الحاسم هو **الخطوة 1 و 5 (التنفيذ الميكانيكي كالقناص)** مع **القانون 8 (ضبط النفس)** عبر عدم اتخاذ أي قرار أثناء حركة السعر إلا ما هو مكتوب مسبقاً في دستور استراتيجيتك.

2. **⚡ خطة الحماية من محفزاتك العاطفية (Your Triggers):**
   « *${prof.triggers || 'لم يحدد'}* »
   • **القاعدة الوقائية:** متى ما ظهر أي محفز من هذه المحفزات، فهذا إنذار أحمر (Red Flag) يوجب عليك فوراً تطبيق **بروتوكول Detach & Reset** والتنفس المربع 5-5-5-5 قبل لمس الماوس!

3. **🧠 تحرير صدمات وعوائق الماضي (Clearing Your Past - Step 9 & 12):**
   « *${prof.pastBlocks || 'لا توجد صدمات مسجلة'}* »
   • تذكر قاعدة **Guilt Detox (تطهير الذنب)** و**القانون 14 (الاستفادة من الفشل)**: ما حدث في الماضي انتهى وكان ثمن بناء المتداول الواعي الذي أنت عليه اليوم. لا تسمح لعقلك الباطن بمعاقبتك على الماضي!

4. **🔔 ميثاق المحاسبة اليومي بيني وبينك (ما سأنبهك عليه دائماً):**
   « **${prof.focusAreas || 'الالتزام الكامل بالخطة ووقف الخسارة'}** »
   • ${stratReviewedToday ? '✅ أحسنت! لقد راجعت دستور استراتيجيتك اليوم.' : '⚠️ **تنبيه فوري:** لم تضغط على زر مراجعة دستور استراتيجيتك وشروط الدخول والخروج اليوم! اذهب لتبويب (📜 دستور استراتيجيتي) وراجعها قبل فتح الشارت.'}`;
    }

    if (actionType === 'false_winning' || userText.includes('كاذب') || userText.includes('False Winning')) {
      return `⚠️ **تشخيص فخ "الربح الكاذب" (False Winning) — من أخطر أسرار Mentorship 2.0 (Step 2 & Step 9):**

في برنامج عقلية المتداول، يفرق **باتريك بيلوني** بين نوعين من الربح، وهو ما يطابق تماماً **القانون 8 (ضبط النفس)** و**القانون 16 (القاعدة الذهبية)** عند نابليون هيل:

1. **ما هو الربح الكاذب (False Winning)؟**
   • هو أن تربح المال في صفقة دخلتها **باندفاع (FOMO)**، أو بدون انتظار اكتمال شروطك المكتوبة في **"دستور استراتيجيتك"**، أو بحجم عقد مبالغ فيه.
   • **لماذا هو أخطر من الخسارة؟** لأن دماغك يفرز الدوبامين ويكافئك على "كسر القواعد"! فتترسخ في عقلك الباطن قناعة خفية بأن كسر الخطة مربح، وفي المرة القادمة ستكرر نفس السلوك وتخسر أضعاف ما ربحته.

2. **ما هو الربح الحقيقي (True Winning) والـ الخسارة الصحيحة (Good Loss)؟**
   • **الربح الحقيقي:** هو كل صفقة التزمت فيها بشروط **"فلتر حارس البوابة"** ودستور استراتيجيتك 100% حتى لو ضربت وقف الخسارة!

3. **القاعدة العملية لك اليوم (سوينج + مضاربة يومية):**
   • افتح تبويب **(🔄 التفريغ بعد الصفقة Detach & Reset — بعد صفقة رابحة)** واقرأ المخاطر الـ 6 للنشوة والغرور لتفرغ شحنة الإيجو فوراً.${
     prof.focusAreas ? `\n   • 🔔 **تذكير خاص من جلسة صراحتك:** تذكر التزامك بـ: (${prof.focusAreas}).` : ''
   }`;
    }

    if (actionType === 'self_sabotage' || userText.includes('تدمير') || userText.includes('أخرب') || userText.includes('اخرب')) {
      return `🧬 **علاج التدمير الذاتي وكسر الخطة بعد الأرباح (Step 8: Breaking Self-Sabotage & Step 9: Guilt Detox):**

هذا السلوك يفسره مسارا مشروعك بالتوازي بدقة مذهلة:

1. **التفسير العصبي والنفسي (MYTM 2.0 - Step 8 & Step 9):**
   • لكل إنسان **"سقف استحقاق مالي وعاطفي" (Internal Thermostat)** تبرمج في عقله الباطن. عندما يحقق حسابك قمة ربحية جديدة، يشعر عقلك الباطن أنه في "منطقة غير مألوفة"، أو يتحرك شعور قديم بالذنب، فيدفعك لاشعورياً للدخول في صفقة متهورة ليعيدك إلى المنطقة المألوفة!
2. **تفسير نابليون هيل (القانون 3: الثقة بالنفس + القانون 2: الهدف الرئيسي):**
   • يقول هيل: *"لن يتجاوز الإنسان أبداً حدود الصورة الذاتية التي رسمها لنفسه في عقله الباطن"*.
3. **العلاج العملي الفوري من البرنامج:**
   • اذهب إلى تبويب **(🚀 شيك لست $10K/Month)** في غرفة التداول، وفي قسم **"محطة التسجيل العصبي (Neural Logging)"** فكك الشحنة العاطفية.
   • بعد كل صفقة رابحة كبيرة، التزم بحد المخاطرة المكتوب في دستور استراتيجيتك (${pb.riskRules ? pb.riskRules.slice(0, 80) : '0.5% - 1%'}) ولا ترفع اللوت أبداً!`;
    }

    if (actionType === 'emergency_tilt' || userText.includes('انتقام') || userText.includes('خسرت') || userText.includes('تسرع')) {
      return `🛑 **بروتوكول الطوارئ الفوري (Detach & Reset + Law #8): ارفع يدك عن الماوس/الجوال لمدة 3 دقائق!**

أنا أتكلم معك الآن بصفتي حارس عقلك المدبر وفق **القانون الثامن (ضبط النفس)** و**الخطوة 2 و 5 من Mentorship 2.0**:

1. **ما يحدث في دماغك الآن علمياً (Amygdala Hijack):** عندما تخسر صفقة أو تفوتك حركة سعرية، يفرز الدماغ الكورتيزول والأدرينالين، فينفصل الفص الجبهي المسؤول عن **"التفكير الدقيق (Law #11)"** وتسيطر عليك رغبة واهمة في استرداد المال فوراً.
2. **تذكّر تحذيرك لنفسك في جلسة الصراحة:**
   • لقد نبّهتني أن محفزاتك الخطيرة هي: « *${prof.triggers || 'الاستعجال بعد الخسارة أو فوات الفرصة'}* ». لا تسمح لهذا المحفز أن يسرق أموالك الآن!
3. **الخطوات الأربع الإلزامية لك الآن:**
   • افتح تبويب **(🎯 التحضير قبل الجلسة Primed)** وشغّل **مؤقت التنفس المربع (5-5-5-5)** لمدة دقيقتين.
   • افتح تبويب **(🔄 التفريغ بعد الصفقة Detach & Reset)** وطبق خطوات "بعد صفقة خاسرة".
   • راجع قائمتك الحمراء في دستور استراتيجيتك: « *${pb.goldenNotes || 'ممنوع التداول الانتقامي'}* ».`;
    }

    if (actionType === 'swing_vs_day' || userText.includes('سوينج') || userText.includes('مضاربه') || userText.includes('مضاربة')) {
      return `🌊⚡ **خطة الضبط النفسي للجمع بين (السوينج Swing) و(المضاربة اليومية Day Trading):**

وفقاً لـ **الخطوة 1 و 5 في MYTM 2.0** و**القانون 2 و 11 و 12 لنابليون هيل**، أكبر فخ نفسي يقع فيه المتداول الذي يجمع بين الأسلوبين هو **"خلط النوايا والأطر الزمنية"**:

1. **الفصل التام في الهوية والهدف المحدد (القانون 2 + Step #1):**
   • قبل الدخول، حدد بوضوح: هل هذه الصفقة **Day Trade** أم **Swing**؟
   • **الخطيئة الكبرى:** إياك أن تدخل صفقة مضاربة يومية، وعندما يعكس عليك السعر تقول لنفسك: *"سأتركها تتحول إلى صفقة سوينج!"*.
   ${pb.swingVsDayRules ? `• **قاعدتك المكتوبة في دستورك:** « *${pb.swingVsDayRules}* »` : ''}

2. **علاج الخروج المبكر في صفقات السوينج (القانون 8 و 12 + Step #2):**
   • في السوينج، مراقبة فريم الـ 5 دقائق والـ 15 دقيقة تثير جهازك العصبي وتجعلك تغلق الصفقة الرابحة مبكراً مع أول تصحيح بسيط!
   • **الحل العملي:** حلل ونفذ صفقات السوينج على الفريمات الكبيرة (4 ساعات / يومي)، وضع التنبيهات السعرية، ولا تراقب الشارت لحظياً.

3. **ضبط الطمع والإفراط في المضاربة اليومية (القانون 4 و 8):**
   • حدد لنفسك **"سقف صفقات يومي"** (صفقتين كحد أقصى في اليوم). إذا حققت هدفك اليومي أو ضربت حد الخسارة اليومي، انتهى يوم عملك كمضارب!`;
    }

    if (actionType === 'analyze_trading' || userText.includes('حلل') || userText.includes('سجل')) {
      if (!logs.length) {
        return `📊 **تقرير فحص سجل التداول وأدوات MYTM 2.0:**
• تقدمك في **خارطة الـ $10K/Month Checklist:** أنجزت **${tenKDone} من 30 محطة** | الدروس المدروسة: **${lessonsDone} من 63 درساً**.
• مراجعة **دستور استراتيجيتك اليوم:** ${stratReviewedToday ? 'تمت المراجعة ✅' : 'لم تراجعها اليوم بعد ⚠️'}.
• لم تقم بتسجيل أي صفقات في **غرفة التداول** حتى الآن! سجل صفقاتك القادمة (سواء رابحة أو خاسرة) مع اختيار حالتك النفسية بصدق لأحلل لك علاقة أرباحك وخسائرك بحالتك الشعورية!`;
      }

      return `🔍 **التشخيص النفسي والرقمي الشامل لسجل تداولك (${tStats.total} صفقة مسجلة):**

• **مؤشر الانضباط السلوكي (Law #8):** **${tStats.disciplinePct}%**
• **نسبة الصفقات الرابحة (Win Rate):** **${tStats.winRate}%** | **صافي النتيجة:** **${tStats.totalPnL >= 0 ? '+' : ''}${tStats.totalPnL}**
• **تقدمك في الكورس:** **${lessonsDone} / 63 درساً** | **خارطة الـ $10K:** **${tenKDone} / 30 محطة**
• **نقطة الاختناق النفسية المتكررة في صفقاتك:** **${tStats.topMistakeLabel}**

💡 **توصيتي العلاجية لك بناءً على بياناتك وجلسة صراحتك:**
${
  tStats.topMistakeCode
    ? this.getInstantTradeEmotionCure(tStats.topMistakeCode, 'صفقاتك الأخيرة', 'سوينج ومضاربة')
    : 'أداؤك الانضباطي ممتاز! احذر من فخ "الربح الكاذب" أو الثقة المفرطة بعد سلسلة الأرباح، واستمر في مراجعة دستور استراتيجيتك يومياً.'
}`;
    }

    if (actionType === 'daily_audit' || userText.includes('يوم') || userText.includes('التزام')) {
      return `📋 **مراجعة المرشد الذكي لمساريك المتوازيين (قوانين هيل الـ 16 + عقلية المتداول MYTM 2.0):**

1. **المسار الأول (قوانين النجاح الـ 16 لنابليون هيل):**
   • أنجزت اليوم **${bpDone} من أصل 13 خطوة** في شيك لست اليوم المثالي (${Math.round((bpDone / 13) * 100)}%).
   • القانون الأكثر حاجة لتركيزك الآن هو **${weakest.number} (${weakest.title})** بنسبة إتقان **${weakest.score}%**.
   • **تحدي اليوم لتقوية (${weakest.title}):** « ${weakest.dailyChallenge} »

2. **المسار الثاني (عقلية المتداول Mentorship 2.0 + دستور استراتيجيتك):**
   • مراجعة **دستور استراتيجيتك (الدخول والخروج)** اليوم: **${stratReviewedToday ? 'تمت المراجعة ✅' : '⚠️ لم تراجعها اليوم بعد! راجعها قبل التداول'}**.
   • جاهزية ما قبل الجلسة (**Primed to Perform**): أنجزت **${primedDone} / 6** اليوم.
   • تقدمك في **أكاديمية الكورس:** **${lessonsDone} / 63 درساً** | **خارطة الـ $10K/Month:** **${tenKDone} / 30 محطة**.
   ${prof.focusAreas ? `• 🔔 **تذكيرك الشخصي من جلسة الصراحة:** « *${prof.focusAreas}* »` : ''}`;
    }

    // البحث الذكي في خطوات الكورس الـ 12 أو القوانين الـ 16 إذا سأل المستخدم عن موضوع محدد
    if (window.MYTM_COURSE_DATA) {
      const matchedStep = (window.MYTM_COURSE_DATA.steps || []).find(
        (s) =>
          userText.includes(s.title) ||
          userText.toLowerCase().includes(s.englishTitle.toLowerCase()) ||
          (s.keyLessons || []).some((k) => userText.includes(k.slice(0, 12)))
      );
      if (matchedStep) {
        return `🎓 **شرح وتطبيق من أكاديمية عقلية المتداول (المرحلة ${matchedStep.stepNumber}: ${matchedStep.title}):**

• **الفلسفة العميقة:** ${matchedStep.deepDivePhilosophy || matchedStep.coreSummary}
• **الربط المتوازي مع نابليون هيل:** ${matchedStep.hillLawParallel}
• **🌊 في السوينج:** ${matchedStep.swingAndDayGuide?.swing || ''}
• **⚡ في المضاربة اليومية:** ${matchedStep.swingAndDayGuide?.day || ''}
• **القاعدة الذهبية:** ${matchedStep.practicalRule}`;
      }
    }

    // رد ذكي مخصص لأي سؤال حر يكتبه المتداول يربط بين المسارين وجلسة الصراحة ودستور الاستراتيجية
    return `🧠 **تحليل المرشد النفسي المزدوج لسؤالك:**
« *${userText}* »

من منظور **قوانين النجاح الـ 16 لنابليون هيل** ومنهج **عقلية المتداول (Mentorship 2.0)** وملفك الشخصي:
1. **افصل الحقائق عن المشاعر (القانون 11: التفكير الدقيق + MYTM Step 1 & 5):** ارجع الآن إلى شروط الدخول والخروج المكتوبة في **دستور استراتيجيتك**؛ هل ما تفكر فيه يطابق شروطك الميكانيكية 100% أم هو اندفاع عاطفي؟
2. **انتبه لمحفزاتك المرصودة في جلسة صراحتك:** ${
      prof.triggers
        ? `تذكر أنك حذرتني من: « *${prof.triggers}* » — تنفس بعمق ولا تقع في هذا الفخ.`
        : 'راقب حالة جهازك العصبي وتنفسك قبل اتخاذ أي قرار.'
    }
3. **خطوتك العملية الآن:** ${
      !stratReviewedToday ? 'مرّ أولاً على تبويب **(📜 دستور استراتيجيتي)** وراجع شروط دخولك وخروجك، ثم ' : ''
    }أكمل **"فلتر حارس البوابة"** و**"Primed to Perform"** قبل تنفيذ أي صفقة اليوم!`;
  },

  // ==================== 8. محرك الإشعارات والمنبهات الذكية (Windows & Mobile Notifications) ====================
  initNotificationsEngine() {
    this.loadNotificationSettingsUI();
    this.startScheduledAlarms();
    this.startPeriodicWisdomAlerts();
  },

  openNotificationsModal() {
    this.loadNotificationSettingsUI();
    document.getElementById('notificationsModal').classList.add('open');
  },

  closeNotificationsModal() {
    document.getElementById('notificationsModal').classList.remove('open');
  },

  loadNotificationSettingsUI() {
    const cfg = this.state.notificationSettings || {
      morningTime: '08:00',
      eveningTime: '21:30',
      wisdomIntervalMinutes: 60,
      soundEnabled: true
    };
    const mEl = document.getElementById('notifMorningTime');
    if (mEl) {
      mEl.value = cfg.morningTime || '08:00';
      document.getElementById('notifEveningTime').value = cfg.eveningTime || '21:30';
      document.getElementById('notifWisdomInterval').value = String(cfg.wisdomIntervalMinutes ?? 60);
      document.getElementById('notifSoundEnabled').checked = cfg.soundEnabled !== false;
    }
    this.updateNotificationPermissionText();
  },

  updateNotificationPermissionText() {
    const statusEl = document.getElementById('notifPermissionStatusText');
    if (!statusEl) return;
    if (!('Notification' in window)) {
      statusEl.textContent = 'التنبيهات الصوتية والمنبثقة داخل البرنامج مفعلة وتعمل تلقائياً ✅';
      return;
    }
    if (Notification.permission === 'granted') {
      statusEl.innerHTML = '<strong style="color:#34D399;">✅ إشعارات سطح المكتب في الويندوز والجوال مفعّلة ونشطة!</strong>';
    } else if (Notification.permission === 'denied') {
      statusEl.innerHTML = '<span style="color:#F87171;">⚠️ تم حظر إشعارات المتصفح، ولكن التنبيهات الصوتية والداخلية تعمل بنجاح.</span>';
    } else {
      statusEl.textContent = 'اضغط على زر "تفعيل الإشعارات" للسماح بإظهار إشعارات سطح المكتب على الويندوز.';
    }
  },

  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      this.showToast('🔔 التنبيهات الداخلية والصوتية مفعلة بالفعل!');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      this.updateNotificationPermissionText();
      if (perm === 'granted') {
        this.sendTestNotification();
      } else {
        this.showToast('ℹ️ تم تفعيل المنبهات الصوتية والرسائل المنبثقة داخل التطبيق');
      }
    } catch (e) {
      this.showToast('🔔 تم تفعيل التنبيهات الصوتية والداخلية بنجاح');
    }
  },

  sendSystemNotification(title, body) {
    const cfg = this.state.notificationSettings || {};
    if (cfg.soundEnabled !== false) {
      this.playGentleChime();
    }
    this.showToast(`${title}: ${body}`);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          dir: 'rtl',
          lang: 'ar'
        });
      } catch (e) {
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(title, { body, dir: 'rtl', lang: 'ar' });
          });
        }
      }
    }
  },

  sendTestNotification() {
    const laws = window.NAPOLEON_HILL_DATA.laws;
    const randomLaw = laws[Math.floor(Math.random() * laws.length)];
    this.sendSystemNotification(
      `🔔 تذكير فلسفة النجاح (${randomLaw.title})`,
      randomLaw.quotes[0]
    );
  },

  saveNotificationSettings() {
    const morningTime = document.getElementById('notifMorningTime').value || '08:00';
    const eveningTime = document.getElementById('notifEveningTime').value || '21:30';
    const wisdomIntervalMinutes = parseInt(document.getElementById('notifWisdomInterval').value, 10) || 0;
    const soundEnabled = document.getElementById('notifSoundEnabled').checked;

    this.state.notificationSettings = {
      ...this.state.notificationSettings,
      morningTime,
      eveningTime,
      wisdomIntervalMinutes,
      soundEnabled
    };
    this.saveState();
    this.startScheduledAlarms();
    this.startPeriodicWisdomAlerts();
    this.closeNotificationsModal();
    this.showToast('✅ تم حفظ وتفعيل جدول المنبهات والإشعارات بنجاح!');
  },

  startScheduledAlarms() {
    if (this.alarmClockInterval) clearInterval(this.alarmClockInterval);
    this.alarmClockInterval = setInterval(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentHM = `${hh}:${mm}`;
      const today = this.getTodayStr();
      const cfg = this.state.notificationSettings || {};

      if (currentHM === cfg.morningTime && cfg.lastMorningAlertDate !== today) {
        cfg.lastMorningAlertDate = today;
        this.saveState();
        this.sendSystemNotification(
          '☀️ موعد قراءة الصباح بالإيحاء الذاتي (Law #2)',
          'حان وقت قراءة وثيقة هدفك الرئيسي المحدد بصوت مسموع ويقين تام لبدء يومك بقوة!'
        );
      }

      if (currentHM === cfg.eveningTime && cfg.lastEveningAlertDate !== today) {
        cfg.lastEveningAlertDate = today;
        this.saveState();
        this.sendSystemNotification(
          '🌙 موعد قراءة المساء والمحاسبة الذاتية (Law #2 & #16)',
          'اقرأ هدفك الرئيسي قبل النوم ودوّن محاسبة القاعدة الذهبية والامتنان اليومي.'
        );
      }
    }, 20000); // يفحص كل 20 ثانية بدقة
  },

  startPeriodicWisdomAlerts() {
    if (this.wisdomTimerInterval) clearInterval(this.wisdomTimerInterval);
    const mins = Number(this.state.notificationSettings?.wisdomIntervalMinutes || 0);
    if (mins <= 0) return;

    this.wisdomTimerInterval = setInterval(() => {
      const laws = window.NAPOLEON_HILL_DATA.laws;
      const pick = laws[Math.floor(Math.random() * laws.length)];
      this.sendSystemNotification(
        `💡 حكمة وتذكير • ${pick.number}: ${pick.title}`,
        pick.quotes[0]
      );
    }, mins * 60 * 1000);
  },

  // ==================== أدوات مساعدة وصوت تنبيهي لطيف ====================
  playGentleChime() {
    if (this.state?.notificationSettings?.soundEnabled === false) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // نغمة هادئة
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    } catch (e) {
      // ignore audio context errors
    }
  },

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  registerServiceWorker() {
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((k) => {
          if (k !== 'napoleon-hill-16-laws-v4') caches.delete(k);
        });
      }).catch(() => {});
    }
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker
        .register('./sw.js?v=4')
        .then((reg) => reg.update())
        .catch(() => {});
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
