import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      brand: "LifeStack",
      tagline: "Personal Decision Intelligence Platform",
      nav: {
        dashboard: "Dashboard",
        miningLab: "Data Mining Lab",
        copilot: "AI Copilot",
        simulator: "What-If Simulator",
        goals: "Goals & Decisions",
        ingest: "Smart Ingestion",
        benchmarks: "Peer Benchmarks",
        privacy: "Privacy Vault",
        admin: "Admin Center",
        landing: "Home",
        login: "Sign In",
        logout: "Sign Out"
      },
      dashboard: {
        title: "Personal Decision Intelligence",
        subtitle: "Synthesizing your financial, academic, career, and wellness records with grounded AI.",
        lifeScoreTitle: "Life Score Composite",
        monthlyBurn: "Monthly Burn Rate",
        savingsRate: "Savings Rate",
        avgSleep: "Sleep Consistency",
        goalsOnTrack: "Goals On Track",
        anomalies30d: "Recent Outliers",
        spendingBreakdown: "90-Day Spending Distribution",
        trendTitle: "Multi-Domain Trajectory & Forecast",
        timelineTitle: "Cross-Correlated Life Events",
        exportCsv: "Export CSV Data",
        exportPng: "Export Visual Report",
        runSimulator: "Run What-If Simulation"
      },
      mining: {
        title: "Data Mining Intelligence Lab",
        subtitle: "Empirical pattern mining algorithms operating directly over your star-schema warehouse.",
        isolationForest: "Isolation Forest Anomaly Detection",
        clustering: "K-Means Peer Persona Clustering",
        apriori: "Cross-Domain Association Rules",
        forecasting: "Holt-Winters Time-Series Projection",
        classification: "Goal Likelihood Random Forest",
        runJob: "Execute Scheduled Mining Pipeline"
      },
      copilot: {
        title: "Grounded GenAI Decision Copilot",
        subtitle: "Zero hallucination. Every response is strictly retrieved from your warehouse and cited.",
        inputPlaceholder: "Ask anything about your finances, career options, EMI affordability, or habits...",
        send: "Consult Copilot",
        listening: "Listening...",
        speak: "Voice Input",
        citations: "Grounded Sources & Citations",
        whyThisAnswer: "Explainability & Confidence",
        disclaimerNotice: "LifeStack outputs are statistical decision projections and do not constitute certified financial or medical advice."
      },
      simulator: {
        title: "Monte Carlo What-If Simulator",
        subtitle: "1,000 stochastic trajectory runs modeling decision outcomes under real-world volatility.",
        currentSavings: "Current Liquid Buffer (₹)",
        targetAmount: "Goal Target (₹)",
        monthlyEmi: "Proposed Course/Asset EMI (₹)",
        savingsRate: "Target Savings Rate (%)",
        horizonMonths: "Time Horizon (Months)",
        runButton: "Simulate 1,000 Paths",
        probabilityLabel: "Goal Achievement Probability"
      },
      common: {
        loading: "Synthesizing Intelligence...",
        error: "An error occurred. Please check network connection.",
        viewAll: "View All",
        confirmed: "Confirmed",
        disclaimer: "Disclaimer: LifeStack provides statistical decision intelligence and is not professional financial, medical, or legal advice."
      }
    }
  },
  hi: {
    translation: {
      brand: "LifeStack",
      tagline: "व्यक्तिगत निर्णय इंटेलिजेंस प्लेटफॉर्म",
      nav: {
        dashboard: "डैशबोर्ड",
        miningLab: "डेटा माइनिंग लैब",
        copilot: "एआई कोपायलट",
        simulator: "व्हाट-इफ सिमुलेटर",
        goals: "लक्ष्य और निर्णय",
        ingest: "स्मार्ट डेटा आयात",
        benchmarks: "समकक्ष तुलना",
        privacy: "गोपनीयता वॉल्ट",
        admin: "प्रशासन केंद्र",
        landing: "मुख्य पृष्ठ",
        login: "लॉग इन करें",
        logout: "लॉग आउट करें"
      },
      dashboard: {
        title: "व्यक्तिगत निर्णय इंटेलिजेंस",
        subtitle: "सत्यापित एआई के साथ आपके वित्तीय, शैक्षणिक, करियर और स्वास्थ्य डेटा का विश्लेषण।",
        lifeScoreTitle: "लाइफ स्कोर समग्र",
        monthlyBurn: "मासिक खर्च दर",
        savingsRate: "बचत दर",
        avgSleep: "नींद की स्थिरता",
        goalsOnTrack: "लक्ष्य सही दिशा में",
        anomalies30d: "हालिया विसंगतियां",
        spendingBreakdown: "90-दिवसीय व्यय वितरण",
        trendTitle: "बहु-डोमेन रुझान और पूर्वानुमान",
        timelineTitle: "जीवन की मुख्य घटनाएं",
        exportCsv: "सीएसवी निर्यात",
        exportPng: "रिपोर्ट डाउनलोड करें",
        runSimulator: "सिमुलेशन चलाएं"
      },
      mining: {
        title: "डेटा माइनिंग इंटेलिजेंस लैब",
        subtitle: "आपके व्यक्तिगत डेटा वेयरहाउस पर सीधे चलने वाले सांख्यिकीय एल्गोरिदम।",
        isolationForest: "आइसोलेशन फॉरेस्ट विसंगति पहचान",
        clustering: "के-मीन्स पर्सोना क्लस्टरिंग",
        apriori: "जीवनशैली एसोसिएशन नियम",
        forecasting: "हॉल्ट-विंटर्स समय-श्रृंखला पूर्वानुमान",
        classification: "लक्ष्य सफलता रैंडम फॉरेस्ट",
        runJob: "माइनिंग पाइपलाइन चलाएं"
      },
      copilot: {
        title: "सत्यापित जेन-एआई निर्णय कोपायलट",
        subtitle: "शून्य भ्रांति। प्रत्येक उत्तर आपके वेयरहाउस से प्रमाणित और संदर्भित है।",
        inputPlaceholder: "अपने खर्च, करियर विकल्प, ईएमआई क्षमता या स्वास्थ्य पर कुछ भी पूछें...",
        send: "पूछें",
        listening: "सुन रहे हैं...",
        speak: "बोलकर पूछें",
        citations: "सत्यापित संदर्भ और स्रोत",
        whyThisAnswer: "व्याख्या और विश्वास स्कोर",
        disclaimerNotice: "लाइफस्टैक के उत्तर सांख्यिकीय अनुमान हैं और पेशेवर वित्तीय या चिकित्सा सलाह नहीं हैं।"
      },
      simulator: {
        title: "मोंटे कार्लो व्हाट-इफ सिमुलेटर",
        subtitle: "1,000 सिमुलेशन रन जो वास्तविक अस्थिरता के तहत परिणामों का मॉडल बनाते हैं।",
        currentSavings: "वर्तमान बचत (₹)",
        targetAmount: "लक्ष्य राशि (₹)",
        monthlyEmi: "प्रस्तावित ईएमआई (₹)",
        savingsRate: "लक्षित बचत दर (%)",
        horizonMonths: "अवधि (महीने)",
        runButton: "1,000 रास्ते सिमुलेट करें",
        probabilityLabel: "लक्ष्य प्राप्ति की संभावना"
      },
      common: {
        loading: "इंटेलिजेंस लोड हो रहा है...",
        error: "एक त्रुटि हुई। कृपया नेटवर्क जांचें।",
        viewAll: "सभी देखें",
        confirmed: "पुष्टि की गई",
        disclaimer: "अस्वीकरण: लाइफस्टैक सांख्यिकीय निर्णय मार्गदर्शन प्रदान करता है और यह प्रमाणित वित्तीय या चिकित्सा सलाह नहीं है।"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
