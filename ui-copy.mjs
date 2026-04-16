export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'zh-CN', label: '简体中文', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'pt', label: 'Português', dir: 'ltr' },
  { code: 'ja', label: '日本語', dir: 'ltr' },
];

export const STRINGS = {
  en: {
    masthead: {
      eyebrow: 'Productivity tool',
      title: 'Timezone Overlap Finder',
      copy:
        'Find overlapping working hours across two or three time zones without losing local-time context.',
    },
    chips: {
      twoZones: '2 time zones',
      threeZones: '3 time zones',
      localContext: 'Local time preserved',
    },
    toolbar: {
      language: 'Language',
      addThirdZone: 'Add a third time zone',
      removeThirdZone: 'Remove the third time zone',
    },
    tool: {
      eyebrow: 'Overlap planner',
      heading: 'Find shared working hours',
      language: 'Language',
      controlsLabel: 'Schedule controls',
      zoneGridLabel: 'Time zone cards',
      thirdZoneOn: 'Add a third time zone',
      thirdZoneOff: 'Remove the third time zone',
      compatNote:
        'Some browsers do not expose the full IANA time zone list. When that happens, the picker uses a built-in fallback list.',
    },
    fields: {
      date: 'Date',
      zone: 'Time zone',
      zoneNumber: 'Time zone {number}',
      location: 'Location',
      start: 'Start',
      end: 'End',
    },
    results: {
      heading: 'Overlap results',
      readyEyebrow: 'Shared hours',
      noOverlap: 'No overlap on this date',
      noOverlapTitle: 'No overlap on this date',
      noOverlapBody: 'Try adjusting one schedule or choose a different day.',
      invalid: 'A time range needs both a start and an end time.',
      invalidTitle: 'One schedule needs attention',
      invalidBody:
        'Check for matching start and end times or a local time that does not exist on this date.',
      empty: 'Add a time zone and both working-hour endpoints for every active card.',
      emptyTitle: 'Complete the schedule',
      emptyBody: 'Add a time zone and both working-hour endpoints for every active card.',
      invalidStatus: 'Needs attention',
      readyNote:
        'Each row keeps the local working window visible and highlights the shared overlap.',
      labels: {
        zone: 'Time zone',
        workingHours: 'Working hours',
        overlap: 'Overlap',
        dayView: 'Day view',
      },
      scale: {
        midnight: '12 AM',
        sixMorning: '6 AM',
        noon: '12 PM',
        sixEvening: '6 PM',
      },
    },
    explanation: {
      heading: 'How this works',
      body:
        'The app compares each local working window on the selected date, then converts the shared overlap back into every chosen time zone.',
    },
    summary: {
      ready: '{duration} shared across {count} time zones on {date}',
      duration: {
        hoursMinutes: '{hours}h {minutes}m',
        hoursOnly: '{hours}h',
        minutesOnly: '{minutes}m',
      },
    },
  },
  'zh-CN': {
    masthead: {
      eyebrow: '协作工具',
      title: 'Timezone Overlap Finder',
      copy: '快速找出两个或三个时区之间重叠的工作时间，并保留每个地区的本地时间语境。',
    },
    chips: {
      twoZones: '2 个时区',
      threeZones: '3 个时区',
      localContext: '保留本地时间',
    },
    toolbar: {
      language: '语言',
      addThirdZone: '添加第三个时区',
      removeThirdZone: '移除第三个时区',
    },
    tool: {
      eyebrow: '重叠规划',
      heading: '查找共享工作时间',
      language: '语言',
      controlsLabel: '日程控制',
      zoneGridLabel: '时区卡片',
      thirdZoneOn: '添加第三个时区',
      thirdZoneOff: '移除第三个时区',
      compatNote: '某些浏览器不会提供完整的 IANA 时区列表。此时会使用内置的备用列表。',
    },
    fields: {
      date: '日期',
      zone: '时区',
      zoneNumber: '时区 {number}',
      location: '地点',
      start: '开始',
      end: '结束',
    },
    results: {
      heading: '重叠结果',
      readyEyebrow: '共享时段',
      noOverlap: '这一天没有重叠时段',
      noOverlapTitle: '这一天没有重叠时段',
      noOverlapBody: '请尝试调整某个日程，或改选其他日期。',
      invalid: '时间范围需要同时包含开始和结束时间。',
      invalidTitle: '有一个日程需要检查',
      invalidBody: '请检查开始和结束时间是否匹配，或确认该日期下该本地时间是否存在。',
      empty: '请为每个启用的卡片选择时区并填写完整的工作时间。',
      emptyTitle: '请先完成日程',
      emptyBody: '请为每个启用的卡片选择时区并填写完整的工作时间。',
      invalidStatus: '需要检查',
      readyNote: '每一行都会保留本地工作时间，并高亮显示共享的重叠时段。',
      labels: {
        zone: '时区',
        workingHours: '工作时间',
        overlap: '重叠',
        dayView: '日视图',
      },
      scale: {
        midnight: '凌晨 12 点',
        sixMorning: '上午 6 点',
        noon: '中午 12 点',
        sixEvening: '下午 6 点',
      },
    },
    explanation: {
      heading: '工作原理',
      body: '应用会先比较所选日期下每个时区的本地工作时间，再把共享重叠段转换回每个时区。',
    },
    summary: {
      ready: '{date} 有 {count} 个时区共享 {duration}',
      duration: {
        hoursMinutes: '{hours}小时 {minutes}分钟',
        hoursOnly: '{hours}小时',
        minutesOnly: '{minutes}分钟',
      },
    },
  },
  hi: {
    masthead: {
      eyebrow: 'उत्पादकता उपकरण',
      title: 'Timezone Overlap Finder',
      copy: 'दो या तीन समय क्षेत्रों में ओवरलैप होने वाले कार्य घंटे खोजें, बिना स्थानीय समय संदर्भ खोए।',
    },
    chips: {
      twoZones: '2 समय क्षेत्र',
      threeZones: '3 समय क्षेत्र',
      localContext: 'स्थानीय समय सुरक्षित',
    },
    toolbar: {
      language: 'भाषा',
      addThirdZone: 'तीसरा समय क्षेत्र जोड़ें',
      removeThirdZone: 'तीसरा समय क्षेत्र हटाएं',
    },
    tool: {
      eyebrow: 'ओवरलैप योजनाकार',
      heading: 'साझा कार्य घंटे खोजें',
      language: 'भाषा',
      controlsLabel: 'शेड्यूल नियंत्रण',
      zoneGridLabel: 'समय क्षेत्र कार्ड',
      thirdZoneOn: 'तीसरा समय क्षेत्र जोड़ें',
      thirdZoneOff: 'तीसरा समय क्षेत्र हटाएं',
      compatNote:
        'कुछ ब्राउज़र पूरी IANA समय क्षेत्र सूची नहीं दिखाते। तब पिकर एक अंतर्निहित बैकअप सूची का उपयोग करता है।',
    },
    fields: {
      date: 'तारीख',
      zone: 'समय क्षेत्र',
      zoneNumber: 'समय क्षेत्र {number}',
      location: 'स्थान',
      start: 'शुरू',
      end: 'समाप्त',
    },
    results: {
      heading: 'ओवरलैप परिणाम',
      readyEyebrow: 'साझा घंटे',
      noOverlap: 'इस तारीख पर कोई ओवरलैप नहीं है',
      noOverlapTitle: 'इस तारीख पर कोई ओवरलैप नहीं है',
      noOverlapBody: 'एक शेड्यूल बदलकर देखें या कोई दूसरी तारीख चुनें।',
      invalid: 'समय सीमा के लिए शुरू और समाप्त, दोनों समय चाहिए।',
      invalidTitle: 'एक शेड्यूल पर ध्यान चाहिए',
      invalidBody:
        'जांचें कि शुरू और समाप्त समय सही हैं या इस तारीख पर वह स्थानीय समय मौजूद नहीं है।',
      empty: 'हर सक्रिय कार्ड के लिए समय क्षेत्र और दोनों समय दर्ज करें।',
      emptyTitle: 'शेड्यूल पूरा करें',
      emptyBody: 'हर सक्रिय कार्ड के लिए समय क्षेत्र और दोनों समय दर्ज करें।',
      invalidStatus: 'ध्यान चाहिए',
      readyNote: 'हर पंक्ति स्थानीय कार्य विंडो दिखाती है और साझा ओवरलैप को हाइलाइट करती है।',
      labels: {
        zone: 'समय क्षेत्र',
        workingHours: 'कार्य घंटे',
        overlap: 'ओवरलैप',
        dayView: 'दिन दृश्य',
      },
      scale: {
        midnight: 'रात 12 बजे',
        sixMorning: 'सुबह 6 बजे',
        noon: 'दोपहर 12 बजे',
        sixEvening: 'शाम 6 बजे',
      },
    },
    explanation: {
      heading: 'यह कैसे काम करता है',
      body:
        'ऐप चुनी गई तारीख पर हर स्थानीय कार्य विंडो की तुलना करता है, फिर साझा ओवरलैप को हर चुने गए समय क्षेत्र में वापस बदलता है।',
    },
    summary: {
      ready: '{date} को {count} समय क्षेत्रों में {duration} साझा है',
      duration: {
        hoursMinutes: '{hours}घं {minutes}मि',
        hoursOnly: '{hours}घं',
        minutesOnly: '{minutes}मि',
      },
    },
  },
  es: {
    masthead: {
      eyebrow: 'Herramienta de productividad',
      title: 'Timezone Overlap Finder',
      copy:
        'Encuentra horarios de trabajo superpuestos en dos o tres zonas horarias sin perder el contexto de la hora local.',
    },
    chips: {
      twoZones: '2 zonas horarias',
      threeZones: '3 zonas horarias',
      localContext: 'Hora local conservada',
    },
    toolbar: {
      language: 'Idioma',
      addThirdZone: 'Añadir una tercera zona horaria',
      removeThirdZone: 'Quitar la tercera zona horaria',
    },
    tool: {
      eyebrow: 'Planificador de solapamientos',
      heading: 'Buscar horas de trabajo compartidas',
      language: 'Idioma',
      controlsLabel: 'Controles del horario',
      zoneGridLabel: 'Tarjetas de zona horaria',
      thirdZoneOn: 'Añadir una tercera zona horaria',
      thirdZoneOff: 'Quitar la tercera zona horaria',
      compatNote:
        'Algunos navegadores no exponen la lista completa de zonas horarias IANA. En ese caso, el selector usa una lista integrada de respaldo.',
    },
    fields: {
      date: 'Fecha',
      zone: 'Zona horaria',
      zoneNumber: 'Zona horaria {number}',
      location: 'Ubicación',
      start: 'Inicio',
      end: 'Fin',
    },
    results: {
      heading: 'Resultados de solapamiento',
      readyEyebrow: 'Horas compartidas',
      noOverlap: 'No hay solapamiento en esta fecha',
      noOverlapTitle: 'No hay solapamiento en esta fecha',
      noOverlapBody: 'Prueba a ajustar un horario o elige otro día.',
      invalid: 'Un rango horario necesita hora de inicio y de fin.',
      invalidTitle: 'Un horario necesita atención',
      invalidBody:
        'Comprueba si la hora de inicio y fin son válidas o si esa hora local no existe en esta fecha.',
      empty: 'Añade una zona horaria y completa ambos extremos del horario en cada tarjeta activa.',
      emptyTitle: 'Completa el horario',
      emptyBody:
        'Añade una zona horaria y completa ambos extremos del horario en cada tarjeta activa.',
      invalidStatus: 'Requiere atención',
      readyNote:
        'Cada fila mantiene visible la ventana local de trabajo y resalta el solapamiento compartido.',
      labels: {
        zone: 'Zona horaria',
        workingHours: 'Horario laboral',
        overlap: 'Solapamiento',
        dayView: 'Vista diaria',
      },
      scale: {
        midnight: '12 a. m.',
        sixMorning: '6 a. m.',
        noon: '12 p. m.',
        sixEvening: '6 p. m.',
      },
    },
    explanation: {
      heading: 'Cómo funciona',
      body:
        'La app compara cada ventana laboral local en la fecha seleccionada y luego convierte el solapamiento compartido a cada zona horaria elegida.',
    },
    summary: {
      ready: '{duration} compartidas entre {count} zonas horarias el {date}',
      duration: {
        hoursMinutes: '{hours} h {minutes} min',
        hoursOnly: '{hours} h',
        minutesOnly: '{minutes} min',
      },
    },
  },
  ar: {
    masthead: {
      eyebrow: 'أداة إنتاجية',
      title: 'Timezone Overlap Finder',
      copy:
        'اعثر على ساعات العمل المتداخلة عبر منطقتين أو ثلاث مناطق زمنية دون فقدان سياق الوقت المحلي.',
    },
    chips: {
      twoZones: 'منطقتان زمنيتان',
      threeZones: '3 مناطق زمنية',
      localContext: 'الوقت المحلي محفوظ',
    },
    toolbar: {
      language: 'اللغة',
      addThirdZone: 'إضافة منطقة زمنية ثالثة',
      removeThirdZone: 'إزالة المنطقة الزمنية الثالثة',
    },
    tool: {
      eyebrow: 'مخطط التداخل',
      heading: 'اعثر على ساعات العمل المشتركة',
      language: 'اللغة',
      controlsLabel: 'عناصر التحكم بالجدول',
      zoneGridLabel: 'بطاقات المناطق الزمنية',
      thirdZoneOn: 'إضافة منطقة زمنية ثالثة',
      thirdZoneOff: 'إزالة المنطقة الزمنية الثالثة',
      compatNote:
        'بعض المتصفحات لا تعرض قائمة IANA الكاملة للمناطق الزمنية. عندها يستخدم المحدد قائمة احتياطية مدمجة.',
    },
    fields: {
      date: 'التاريخ',
      zone: 'المنطقة الزمنية',
      zoneNumber: 'المنطقة الزمنية {number}',
      location: 'الموقع',
      start: 'البداية',
      end: 'النهاية',
    },
    results: {
      heading: 'نتائج التداخل',
      readyEyebrow: 'الساعات المشتركة',
      noOverlap: 'لا يوجد تداخل في هذا التاريخ',
      noOverlapTitle: 'لا يوجد تداخل في هذا التاريخ',
      noOverlapBody: 'جرّب تعديل أحد الجداول أو اختر يومًا مختلفًا.',
      invalid: 'نطاق الوقت يحتاج إلى وقت بداية ونهاية.',
      invalidTitle: 'هناك جدول يحتاج إلى مراجعة',
      invalidBody:
        'تحقق من أن وقتي البداية والنهاية صالحان أو أن هذا الوقت المحلي موجود في هذا التاريخ.',
      empty: 'أضف منطقة زمنية واملأ نقطتي البداية والنهاية لكل بطاقة مفعلة.',
      emptyTitle: 'أكمل الجدول',
      emptyBody: 'أضف منطقة زمنية واملأ نقطتي البداية والنهاية لكل بطاقة مفعلة.',
      invalidStatus: 'يحتاج إلى مراجعة',
      readyNote:
        'يحافظ كل صف على نافذة العمل المحلية ويبرز التداخل المشترك.',
      labels: {
        zone: 'المنطقة الزمنية',
        workingHours: 'ساعات العمل',
        overlap: 'التداخل',
        dayView: 'عرض اليوم',
      },
      scale: {
        midnight: '12 ص',
        sixMorning: '6 ص',
        noon: '12 م',
        sixEvening: '6 م',
      },
    },
    explanation: {
      heading: 'كيف يعمل هذا',
      body:
        'يقارن التطبيق كل نافذة عمل محلية في التاريخ المحدد، ثم يحول التداخل المشترك إلى كل منطقة زمنية مختارة.',
    },
    summary: {
      ready: '{duration} مشتركة عبر {count} مناطق زمنية في {date}',
      duration: {
        hoursMinutes: '{hours} س {minutes} د',
        hoursOnly: '{hours} س',
        minutesOnly: '{minutes} د',
      },
    },
  },
  fr: {
    masthead: {
      eyebrow: 'Outil de productivité',
      title: 'Timezone Overlap Finder',
      copy:
        'Trouvez les horaires de travail qui se chevauchent entre deux ou trois fuseaux horaires sans perdre le contexte local.',
    },
    chips: {
      twoZones: '2 fuseaux horaires',
      threeZones: '3 fuseaux horaires',
      localContext: 'Heure locale conservée',
    },
    toolbar: {
      language: 'Langue',
      addThirdZone: 'Ajouter un troisième fuseau horaire',
      removeThirdZone: 'Supprimer le troisième fuseau horaire',
    },
    tool: {
      eyebrow: 'Planificateur de chevauchement',
      heading: 'Trouver les heures de travail communes',
      language: 'Langue',
      controlsLabel: 'Commandes du planning',
      zoneGridLabel: 'Cartes de fuseaux horaires',
      thirdZoneOn: 'Ajouter un troisième fuseau horaire',
      thirdZoneOff: 'Supprimer le troisième fuseau horaire',
      compatNote:
        'Certains navigateurs n’exposent pas la liste complète des fuseaux IANA. Dans ce cas, le sélecteur utilise une liste de secours intégrée.',
    },
    fields: {
      date: 'Date',
      zone: 'Fuseau horaire',
      zoneNumber: 'Fuseau horaire {number}',
      location: 'Lieu',
      start: 'Début',
      end: 'Fin',
    },
    results: {
      heading: 'Résultats de chevauchement',
      readyEyebrow: 'Heures partagées',
      noOverlap: 'Aucun chevauchement à cette date',
      noOverlapTitle: 'Aucun chevauchement à cette date',
      noOverlapBody: 'Essayez d’ajuster un horaire ou choisissez un autre jour.',
      invalid: 'Une plage horaire nécessite une heure de début et une heure de fin.',
      invalidTitle: 'Un horaire nécessite une vérification',
      invalidBody:
        'Vérifiez les heures de début et de fin ou si cette heure locale existe bien à cette date.',
      empty: 'Ajoutez un fuseau horaire et renseignez le début et la fin pour chaque carte active.',
      emptyTitle: 'Complétez le planning',
      emptyBody:
        'Ajoutez un fuseau horaire et renseignez le début et la fin pour chaque carte active.',
      invalidStatus: 'À vérifier',
      readyNote:
        'Chaque ligne conserve la fenêtre de travail locale et met en évidence le chevauchement partagé.',
      labels: {
        zone: 'Fuseau horaire',
        workingHours: 'Heures de travail',
        overlap: 'Chevauchement',
        dayView: 'Vue jour',
      },
      scale: {
        midnight: '0 h',
        sixMorning: '6 h',
        noon: '12 h',
        sixEvening: '18 h',
      },
    },
    explanation: {
      heading: 'Comment ça marche',
      body:
        'L’application compare chaque fenêtre de travail locale à la date choisie, puis reconvertit le chevauchement partagé dans chaque fuseau horaire sélectionné.',
    },
    summary: {
      ready: '{duration} partagées sur {count} fuseaux horaires le {date}',
      duration: {
        hoursMinutes: '{hours} h {minutes} min',
        hoursOnly: '{hours} h',
        minutesOnly: '{minutes} min',
      },
    },
  },
  pt: {
    masthead: {
      eyebrow: 'Ferramenta de produtividade',
      title: 'Timezone Overlap Finder',
      copy:
        'Encontre horários de trabalho sobrepostos em dois ou três fusos horários sem perder o contexto do horário local.',
    },
    chips: {
      twoZones: '2 fusos horários',
      threeZones: '3 fusos horários',
      localContext: 'Hora local preservada',
    },
    toolbar: {
      language: 'Idioma',
      addThirdZone: 'Adicionar um terceiro fuso horário',
      removeThirdZone: 'Remover o terceiro fuso horário',
    },
    tool: {
      eyebrow: 'Planejador de sobreposição',
      heading: 'Encontrar horas de trabalho em comum',
      language: 'Idioma',
      controlsLabel: 'Controles da agenda',
      zoneGridLabel: 'Cartões de fuso horário',
      thirdZoneOn: 'Adicionar um terceiro fuso horário',
      thirdZoneOff: 'Remover o terceiro fuso horário',
      compatNote:
        'Alguns navegadores não expõem a lista completa de fusos IANA. Quando isso acontece, o seletor usa uma lista interna de fallback.',
    },
    fields: {
      date: 'Data',
      zone: 'Fuso horário',
      zoneNumber: 'Fuso horário {number}',
      location: 'Local',
      start: 'Início',
      end: 'Fim',
    },
    results: {
      heading: 'Resultados da sobreposição',
      readyEyebrow: 'Horas compartilhadas',
      noOverlap: 'Sem sobreposição nesta data',
      noOverlapTitle: 'Sem sobreposição nesta data',
      noOverlapBody: 'Tente ajustar um horário ou escolher outro dia.',
      invalid: 'Um intervalo precisa de horário de início e de fim.',
      invalidTitle: 'Um horário precisa de atenção',
      invalidBody:
        'Verifique se os horários de início e fim são válidos ou se esse horário local existe nesta data.',
      empty: 'Adicione um fuso horário e preencha os dois limites de horário em cada cartão ativo.',
      emptyTitle: 'Complete o horário',
      emptyBody:
        'Adicione um fuso horário e preencha os dois limites de horário em cada cartão ativo.',
      invalidStatus: 'Precisa de atenção',
      readyNote:
        'Cada linha mantém a janela de trabalho local visível e destaca a sobreposição compartilhada.',
      labels: {
        zone: 'Fuso horário',
        workingHours: 'Horário de trabalho',
        overlap: 'Sobreposição',
        dayView: 'Visão do dia',
      },
      scale: {
        midnight: '0h',
        sixMorning: '6h',
        noon: '12h',
        sixEvening: '18h',
      },
    },
    explanation: {
      heading: 'Como funciona',
      body:
        'O app compara cada janela de trabalho local na data selecionada e depois converte a sobreposição compartilhada de volta para cada fuso horário escolhido.',
    },
    summary: {
      ready: '{duration} compartilhadas entre {count} fusos horários em {date}',
      duration: {
        hoursMinutes: '{hours} h {minutes} min',
        hoursOnly: '{hours} h',
        minutesOnly: '{minutes} min',
      },
    },
  },
  ja: {
    masthead: {
      eyebrow: '生産性ツール',
      title: 'Timezone Overlap Finder',
      copy: '2つまたは3つのタイムゾーンで重なる勤務時間を、現地時間の文脈を保ったまま見つけます。',
    },
    chips: {
      twoZones: '2つのタイムゾーン',
      threeZones: '3つのタイムゾーン',
      localContext: '現地時間を保持',
    },
    toolbar: {
      language: '言語',
      addThirdZone: '3つ目のタイムゾーンを追加',
      removeThirdZone: '3つ目のタイムゾーンを削除',
    },
    tool: {
      eyebrow: '重なりプランナー',
      heading: '共有される勤務時間を探す',
      language: '言語',
      controlsLabel: 'スケジュール操作',
      zoneGridLabel: 'タイムゾーンカード',
      thirdZoneOn: '3つ目のタイムゾーンを追加',
      thirdZoneOff: '3つ目のタイムゾーンを削除',
      compatNote:
        '一部のブラウザでは IANA タイムゾーン一覧がすべて取得できません。その場合は内蔵の代替一覧を使います。',
    },
    fields: {
      date: '日付',
      zone: 'タイムゾーン',
      zoneNumber: 'タイムゾーン {number}',
      location: '場所',
      start: '開始',
      end: '終了',
    },
    results: {
      heading: '重なりの結果',
      readyEyebrow: '共有時間',
      noOverlap: 'この日付には重なりがありません',
      noOverlapTitle: 'この日付には重なりがありません',
      noOverlapBody: '勤務時間を調整するか、別の日付を選んでください。',
      invalid: '時間範囲には開始時刻と終了時刻の両方が必要です。',
      invalidTitle: '確認が必要な勤務時間があります',
      invalidBody:
        '開始時刻と終了時刻を確認するか、この日付にその現地時刻が存在するか確認してください。',
      empty: '有効なカードごとにタイムゾーンと勤務時間の両端を入力してください。',
      emptyTitle: '勤務時間を入力してください',
      emptyBody: '有効なカードごとにタイムゾーンと勤務時間の両端を入力してください。',
      invalidStatus: '要確認',
      readyNote:
        '各行は現地の勤務時間を表示したまま、共有された重なりを強調します。',
      labels: {
        zone: 'タイムゾーン',
        workingHours: '勤務時間',
        overlap: '重なり',
        dayView: '日表示',
      },
      scale: {
        midnight: '午前0時',
        sixMorning: '午前6時',
        noon: '正午',
        sixEvening: '午後6時',
      },
    },
    explanation: {
      heading: '仕組み',
      body:
        'アプリは選択した日付の各ローカル勤務時間を比較し、共有された重なりを選択された各タイムゾーンへ戻して表示します。',
    },
    summary: {
      ready: '{date} に {count} 個のタイムゾーンで {duration} を共有',
      duration: {
        hoursMinutes: '{hours}時間 {minutes}分',
        hoursOnly: '{hours}時間',
        minutesOnly: '{minutes}分',
      },
    },
  },
};

const DEFAULT_LANGUAGE_ENTRY = SUPPORTED_LANGUAGES.find(
  (language) => language.code === DEFAULT_LANGUAGE,
);

function interpolate(template, variables = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(variables[key] ?? ''));
}

function getPath(source, key) {
  return key.split('.').reduce((current, part) => current?.[part], source);
}

export function getLanguage(code) {
  return SUPPORTED_LANGUAGES.find((language) => language.code === code) ?? DEFAULT_LANGUAGE_ENTRY;
}

export function formatDisplayDate(code, isoDate) {
  const date = new Date(`${isoDate}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat(getLanguage(code).code, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(date);
}

export function buildDocumentCopy(code) {
  const languageCode = getLanguage(code).code;

  return {
    title: `${translate(languageCode, 'tool.heading')} | ${translate(languageCode, 'masthead.title')}`,
    description: translate(languageCode, 'masthead.copy'),
  };
}

export function translate(code, key, variables) {
  const languageCode = getLanguage(code).code;
  const source = STRINGS[languageCode] ?? STRINGS[DEFAULT_LANGUAGE];
  const value = getPath(source, key);

  if (typeof value !== 'string') {
    throw new Error(`Missing translation for ${languageCode}:${key}`);
  }

  return interpolate(value, variables);
}
