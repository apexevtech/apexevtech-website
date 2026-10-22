import { engineeringCases } from "@/data/engineering-cases";
import { applicationScenarios, solutionBriefs, type TechnicalLibraryEntry } from "@/data/technical-library";

type CaseTranslation = { title: string; summary: string; focus: string[]; alt: string };
type MaterialTranslation = { title: string; summary: string; requirements: [string, string, string]; output: string; note: string; link: string; sourceTitle: string; sourceSummary: string; sourceNote: string; alt?: string };

const caseTranslations: Record<string, CaseTranslation> = {
  "case-1": { title: "CCS 充电设备实验室测试", summary: "本应用参考介绍在模拟运行条件下对 CCS 充电设备进行实验室测试，重点涵盖供电特性、充电输出、通信和保护功能。", focus: ["供电与充电输出", "通信行为", "保护功能"], alt: "多台充电测试机柜" },
  "case-2": { title: "车桩现场故障诊断", summary: "本现场诊断参考介绍如何采集充电信息，用于故障分析和维护提醒，重点观察车桩交互，并支持排查充电场站出现的异常现象。", focus: ["充电数据采集", "故障分析", "维护提醒"], alt: "实验室内连接堆叠测试负载的便携式充电诊断仪" },
  "case-3": { title: "模拟充电互操作性测试", summary: "本互操作性参考介绍通过模拟充电设施行为检查车辆通信和数据交换，重点关注兼容性检查中车辆端实现与充电设备之间的交互。", focus: ["充电设施模拟", "车辆通信", "兼容性检查"], alt: "连接在白色电动汽车与充电桩之间的便携式充电测试仪" },
  "case-4": { title: "欧标接口充电设备评估", summary: "本科研机构应用参考介绍欧标充电设备评估，将技术内容分为电气安全、基本充电运行以及充电设备与所连接车辆的兼容性。", focus: ["电气安全", "充电运行", "接口兼容性"], alt: "技术人员在实验室内检查便携式充电测试仪" },
  "case-5": { title: "科研机构充电测试仪器", summary: "本科研机构参考将某未具名机构与充电测试仪器关联。标题未附可读的项目说明，因此具体测试应用及配置尚不明确。", focus: ["充电测试仪器", "科研机构应用背景"], alt: "实验室测试机柜旁的便携式电动汽车充电测试仪" },
  "case-6": { title: "充电需求与功率仿真", summary: "本电力研究参考聚焦充电需求及能耗建模，结合仿真讨论设备布局、充电调度以及充电设施功率需求规划。", focus: ["充电需求建模", "能耗仿真", "布局与调度"], alt: "技术人员在电动汽车和充电桩旁检查充电测试设备" },
  "case-7": { title: "直流超充现场检测", summary: "本第三方检测参考介绍通过模拟车辆行为，对非车载直流充电机进行现场检查。所引用的历史标准仅用于说明该应用背景，不代表当前符合性覆盖范围。", focus: ["车辆行为模拟", "非车载直流充电", "现场检测"], alt: "两名技术人员在实验室操作便携式充电测试仪" },
  "case-8": { title: "检测行业充电测试仪器", summary: "本检测行业参考介绍独立评估场景中的充电测试仪器。公开说明较为简略，因此不据此推断仪器主题以外的已完成测试结果。", focus: ["充电测试仪器", "独立评估应用背景"], alt: "实验台上摆放的两台便携式充电测试仪和两台负载设备" },
  "case-9": { title: "直流充电机输出与保护评估", summary: "本直流充电机参考关注输出电压、电流、功率及保护行为的评估，将电气性能测量与安全相关观察纳入同一充电测试场景。", focus: ["电压与电流", "充电功率", "保护行为"], alt: "技术人员在有顶棚的充电场站操作直流充电桩旁的测试设备" },
  "case-10": { title: "非车载充电机协议评估", summary: "本非车载充电机参考介绍通信数据检查及协议行为，并将完整性和通信稳定性作为某未具名检测公司的技术评估主题。", focus: ["通信数据检查", "协议行为", "通信稳定性"], alt: "连接至直流充电桩的便携式充电测试仪和带轮负载设备" },
  "case-11": { title: "定制交流／直流充电测量", summary: "本定制仪器参考介绍结合软件分析的交流及直流充电输出测量，说明电气参数与分析功能如何用于综合充电设备测量应用。", focus: ["交流充电输出", "直流充电输出", "测量分析"], alt: "车内装载的便携式充电测试仪、负载和笔记本电脑" },
  "case-12": { title: "充电场站现场评估", summary: "本独立检测参考介绍涉及电气参数、充电性能和维护诊断的充电场站检查，将现场观察与充电设施检测及故障排查中的技术问题相结合。", focus: ["电气参数", "充电性能", "维护诊断"], alt: "打开的充电机柜旁的便携式充电测试仪和堆叠负载" },
  "case-13": { title: "定制直流充电测试配置", summary: "本定制设备参考关注某未具名第三方实验室的直流充电机电气性能及安全检查，以专用测试仪器作为独立评估的技术背景。", focus: ["直流电气性能", "安全检查", "定制测试设备"], alt: "实验台上的便携式充电测试仪、笔记本电脑和测量单元" },
  "case-14": { title: "产线嵌入式充电测试", summary: "本制造应用参考介绍嵌入生产线的充电测试，重点是在测试过程中同步记录生产批次和序列号，以支持设备识别和追溯。", focus: ["产线测试", "批次识别", "序列号追溯"], alt: "沿装配线布置的测试工位" },
  "case-15": { title: "车辆交流／直流充电互操作性", summary: "本车辆端参考介绍交流及直流充电时序和受控故障模拟，重点关注互操作性评估中车辆充电行为与充电设备之间的交互。", focus: ["交流与直流充电时序", "车辆端交互", "受控故障模拟"], alt: "连接至电动汽车的便携式测试仪和示波器" },
  "case-16": { title: "车辆充电报文一致性", summary: "本车辆工程参考介绍充电报文格式、指令处理及错误响应检查，以不同车辆实现与充电设备交互时的通信一致性为技术主题。", focus: ["报文格式", "指令处理", "错误响应"], alt: "引擎盖打开的电动汽车旁的便携式测试仪和笔记本电脑" },
  "case-17": { title: "直流充电机自动化产线测试", summary: "本直流充电制造参考介绍电压、电流及功率自动检查和报告生成，将电气测量与测试报告纳入生产线测试应用。", focus: ["自动化生产检查", "电压、电流与功率", "报告生成"], alt: "工业厂房中沿滚筒输送线布置的自动化测试工位" },
  "case-18": { title: "定制直流超充测试系统", summary: "本定制超充参考介绍由测量仪器、控制器、电源设备和分析软件组成的配置，重点说明讨论直流充电测试应用时使用的系统构成。", focus: ["测量仪器", "控制与电源设备", "分析软件"], alt: "通过充电电缆连接至测量机柜的直流充电桩" },
};

const materialTranslations: Record<string, MaterialTranslation> = {
  "evse-laboratory-planning": {
    title: "充电设备实验室规划", summary: "围绕待研究的充电接口和技术问题定义实验室范围，在经评审的测试边界内协调车辆行为模拟、电气测量、通信记录和功率路径。",
    requirements: ["明确充电设备版本、连接器、固件及范围内的具体标准版本。", "区分接口额定值、持续功率要求、外部负载和场地限制。", "定义测试条件、预期响应和工程评审所需的原始记录。"], output: "用于实验室规划的配置边界、设备职责清单和带版本的测试矩阵。", note: "设备选型与测试覆盖范围需经配置评审；本简介不代表实验室认可或符合性结论。", link: "实验室参考架构",
    sourceTitle: "电动汽车充电设备测试", sourceSummary: "赛特介绍了用于研究充电设备功能、车桩交互及异常工况的模拟实验室场景。页面概述相关主题，未发布可复现的测试程序或完整结果记录。", sourceNote: "第三方概述，不作为 APEX 交付证明。未提供设备配置、标准版本或原始结果。", alt: "连接充电电缆的交流充电桩",
  },
  "vehicle-charger-interaction-planning": {
    title: "车桩交互范围规划", summary: "规划指定车辆端实现与所选充电接口之间的交互，分别定义会话时序、通信行为和电气响应，让每项兼容性问题都有可评审的测试条件。",
    requirements: ["列明车辆端角色、充电接口、通信选项和软件版本。", "选择正常、边界及受控故障时序，明确启动与停止条件。", "在共同的会话时间线上对齐报文采集、导引状态和电气观察。"], output: "边界明确的交互矩阵，注明各会话的配置依赖与证据要求。", note: "所选测试矩阵不能证明与所有车辆或充电设备兼容；支持的实现需另行确认。", link: "充电协议规划指南",
    sourceTitle: "新能源汽车充电测试", sourceSummary: "赛特讨论了充电效率、充电时间及基础设施可达性的差异。文章提出一般车辆充电问题，未明确研究样本、设备配置或实测数据集。", sourceNote: "第三方概述，不作为 APEX 交付证明。有关充电时间和效率的观察并非经独立核实的结果。", alt: "电动汽车连接充电桩的示意图",
  },
  "pv-storage-integration-planning": {
    title: "光伏与储能集成规划", summary: "规划协同运行前，先将充电设备、发电、储能和场站控制器划分为独立子系统，明确各能量流的控制方以及功率、限制条件和保护响应的观察位置。",
    requirements: ["绘制功率路径中的电源、储能、变流器、充电设备、负载和测量点。", "明确各场景的初始能量状态、控制归属、切换过程和运行限制。", "确认场地许可、保护职责以及拟采用的能量回馈路径。"], output: "子系统职责图及协同能量流评审场景矩阵。", note: "此处定义集成规划边界，不表示包含任何特定光伏、储能或双向充放电配置。", link: "能源集成参考架构",
    sourceTitle: "光伏与储能测试", sourceSummary: "赛特介绍光伏发电与电池储能的关系，包括将能量存储以供后续使用。页面讨论集成主题，未记录具体测试系统、项目配置或实测性能。", sourceNote: "第三方概述，不作为 APEX 交付证明。无量化效率结果或明确测试条件。", alt: "光伏组件阵列",
  },
  "battery-power-interface-planning": {
    title: "电池与功率接口规划", summary: "定义电池端接口、模拟器或外部电源设备在充电项目中的作用，将充电通信及功率路径问题与电芯特性或电池寿命测试区分。",
    requirements: ["明确项目需要模拟电池响应、实际电池接口，还是另行提供的负载。", "明确各连接处的电压、电流、能量方向、工况曲线及保护责任方。", "记录接口信号、控制职责及评审充电行为所需的测量。"], output: "用于充电测试范围的接口职责表及功率设备评审清单。", note: "本简介不构成电池测试系统报价，也不证明具备电芯、电池包、循环或环境测试能力。", link: "测试系统选型指南",
    sourceTitle: "电池测试", sourceSummary: "赛特概述重复充放电循环、环境暴露及充电速度等电池评估主题。一般性比较未明确电池样本、循环条件、评估方法或基础数据报告。", sourceNote: "第三方主题参考，不是 APEX 电池测试产品或交付记录。APEX 简介范围仍限于充电项目接口。", alt: "打开的电池包示意图",
  },
  "field-diagnostics-planning": {
    title: "现场诊断规划", summary: "围绕已安装充电设备及待调查工况准备现场工作，建立安全前提、可复现的基准时序和证据包，以支持维修评审或升级至实验室分析。",
    requirements: ["出发前记录充电设备资产、连接器、额定值、固件及报告的现场问题。", "确认访问权限、安全程序、仪器及已批准的能量吸收配置。", "选择可复现的检查，并保留对应的配置、通信和测量记录。"], output: "针对具体场地的访问计划，包含基准检查、证据字段及升级处理决策路径。", note: "允许开展的工作取决于现场管理与所选设备；诊断计划不等于检验证书。", link: "移动调试参考流程",
    sourceTitle: "运维检测", sourceSummary: "赛特将运维检测列为解决方案类别。可读正文涉及互联网平台安全、漏洞扫描和渗透测试，而非明确的充电设备现场诊断方法。", sourceNote: "仅作类别参考：正文主题不匹配，不能证明 APEX 充电工作流程或交付。", alt: "电动汽车旁手持的充电连接器",
  },
  "custom-test-integration-planning": {
    title: "定制测试集成规划", summary: "将定制测试需求分解为设备接口、受控时序和证据职责，在定义预期交付边界前，评审工装、软件、场地及数据系统依赖。",
    requirements: ["描述被测设备版本、测试目标、排除项及运行环境。", "明确需要单独集成的工装、功率设备、安全控制和软件接口。", "定义可评审的验收标准、数据格式和配置变更职责。"], output: "覆盖各项需求、接口、验收检查及未解决依赖的范围矩阵。", note: "定制功能与外部系统连接需经工程评审，不应视为标准产品固有能力。", link: "充电设备测试计划清单",
    sourceTitle: "其他测试类别", sourceSummary: "赛特在主要解决方案之外设置了其他测试类别。文章将一般充电设备介绍与互联网安全测试措辞混合，未定义定制充电测试系统或集成边界。", sourceNote: "仅作类别参考：正文主题不匹配，不能证明 APEX 定制功能或交付。", alt: "变电站电气设备",
  },
  "ccs2-laboratory-scope": {
    title: "CCS2 实验室测试范围", summary: "将所需充电时序与接口模拟、通信采集和电气功率路径关联，规划 CCS2 充电设备研究。",
    requirements: ["明确待评审的充电设备版本、CCS2 连接和通信模式。", "区分连接器额定值、实测输出和持续负载要求。", "定义正常及受控故障用例、预期响应和需保留的证据。"], output: "CCS2 范围表，包含设备边界及各用例的证据清单。", note: "仅有接口模拟不能证明持续满功率运行能力或完整标准覆盖。", link: "CCS2 充电测试指南",
    sourceTitle: "CCS 充电测试系统应用", sourceSummary: "赛特将 CCS 充电设备实验室测试作为应用介绍，讨论供电特性、充电功率、通信及保护功能。文章描述模拟运行条件，未明确客户、设备配置或留存测量记录。", sourceNote: "供应商发布的案例，不作为 APEX 交付证明。未提供经独立核实的项目结果或完整配置。", alt: "多台充电测试机柜",
  },
  "site-fault-diagnosis": {
    title: "充电场站故障诊断", summary: "围绕一项已报告的充电问题组织现场调查，统一保留场地标识、配置及首个异常会话状态。",
    requirements: ["记录已安装资产、报告的故障现象及复现所需条件。", "确认连接器访问条件、安全权限及允许检查的能量路径。", "使用一致的测量点采集正常基准和受影响时序。"], output: "诊断访问记录，包含观察、配置限制和升级处理措施。", note: "现场调查仅记录已检查工况，不证明范围以外不存在故障。", link: "现场设备规划指南",
    sourceTitle: "车桩诊断设备现场测试", sourceSummary: "赛特介绍了用于采集充电信息、分析故障和提醒维护人员的诊断设备。案例页提供一般使用说明，未记录该场地的调查过程或实测维修结果。", sourceNote: "供应商发布的案例，不作为 APEX 交付证明。客户身份、配置及维护收益声明未经独立核实。",
  },
  "interoperability-scope-review": {
    title: "互操作性范围评审", summary: "明确互操作性评审涵盖哪些车辆端和充电端实现，选择可复现的交互，避免无边界的兼容性声明。",
    requirements: ["列明接口类型、通信实现及硬件或固件组合。", "选择会话切换、边界值和受控异常进行比较。", "定义区分配置问题与交互不匹配所需的证据。"], output: "边界明确的互操作性矩阵，包含配置标识和待确认假设。", note: "覆盖范围仅限于选定配置和评审用例，不代表通用互操作性结果。", link: "协议范围规划指南",
    sourceTitle: "车辆互操作性测试系统 ST-9980X", sourceSummary: "赛特介绍通过模拟充电设施检查通信、数据交换和车桩交互。ST-9980X 出现在页面标题中，但文章未明确实施配置、测试矩阵或结果。", sourceNote: "供应商发布的案例，不作为 APEX 交付证明。原文交互术语混用，系统范围及结果需进一步确认。",
  },
  "european-interface-evaluation": {
    title: "Type 2 与 CCS2 接口规划", summary: "评估规划前先区分 Type 2 交流与 CCS2 直流要求，将各项电气、导引和通信问题分配至适当配置。",
    requirements: ["明确范围涉及 Type 2 交流、CCS2 直流，还是两种接口。", "记录适用标准版本、连接器额定值及所需观察。", "分别为各接口分配测量、激励和判定规则。"], output: "按接口划分的评估矩阵，明确设备与证据职责。", note: "接口名称不代表符合性结论；正式评估范围需另行约定。", link: "标准验证准备指南",
    sourceTitle: "某研究机构欧标充电设备测试", sourceSummary: "赛特将欧标充电设备评估划分为安全、基本运行和兼容性主题。案例提及某未具名研究机构，但未发布适用标准版本、设备详情或项目测试记录。", sourceNote: "供应商发布的案例，不作为 APEX 交付或认证证明。标准覆盖及评估结果未经独立核实。",
  },
  "third-party-measurement-plan": {
    title: "第三方测量规划", summary: "选择仪器或报告字段前，将充电设备测量需求转化为可观察的量、运行条件和可评审记录。",
    requirements: ["定义各被测量、工作点、参考方法和所需测量范围。", "评审仪器适用性、校准职责和相关不确定度输入。", "将各报告值关联至配置、限值、原始记录和配置版本。"], output: "用于独立技术评审的测量计划及报告字段映射。", note: "本计划不声明实验室认可、测量精度或已完成的验证结果。", link: "测量与证据清单",
    sourceTitle: "上海某研究机构充电测试仪", sourceSummary: "赛特案例标题将充电测试仪与上海某未具名研究机构关联。可读页面无项目叙述，因此测试配置、测量需求和实施结果均不明确。", sourceNote: "仅为标题层面的第三方参考，不作为 APEX 交付证明。未提供可读项目详情或测量报告。",
  },
  "charging-power-scenario-plan": {
    title: "充电功率场景规划", summary: "以设定点和切换序列描述所需充电工况，区分模拟需求、实测充电输出与场地供电约束。",
    requirements: ["明确所需电压、电流、持续时间、切换过程及初始条件。", "确认每个拟定工作点的电源、负载和冷却边界。", "定义命令与实测功率需要同步记录的位置。"], output: "功率场景表，注明场地约束与测量职责。", note: "场景规划不证明节能效果、充电时间改善或持续功率能力。", link: "负载与能量路径规划指南",
    sourceTitle: "电力研究机构充电功率仿真", sourceSummary: "赛特介绍充电需求和能耗的数学建模及仿真，用于讨论布局和调度。文章未提供模型输入、验证记录或效率收益声明的数值依据。", sourceNote: "供应商发布的案例，不作为 APEX 交付证明。所称效率改善并非经独立核实的实测结果。",
  },
  "high-power-duty-review": {
    title: "大功率工况评审", summary: "沿完整连接与能量路径评审拟定的大功率充电工况，分别确认接口、仪器、负载和冷却限制。",
    requirements: ["明确同时施加的电压、电流、持续时间及预期工况曲线。", "检查电缆、连接器、外部负载、保护及冷却职责。", "定义运行限制、停止条件和评审所需测量。"], output: "工况边界评审，包含部件限制和未解决的设备依赖。", note: "型号名称或连接器额定值不能证明满功率测试运行能力；完整配置需确认。", link: "直流快充规划指南",
    sourceTitle: "与 CQC 相关的超充设施测试", sourceSummary: "赛特案例页提及中国质量认证中心，并介绍 ST-HCDC-800A 通过模拟车辆行为进行第三方直流充电机现场检查。页面列出标准参考，未包含项目测量或经核实的运行边界。", sourceNote: "供应商发布的案例，并非 APEX 交付或背书。历史标准和型号名称不能证明当前覆盖范围或实测功率。",
  },
  "integrated-measurement-plan": {
    title: "集成测量规划", summary: "协调电气测量、会话状态和通信记录，使工程评审人员能够追踪充电设备如何响应指定激励。",
    requirements: ["明确测量点、信号和各项记录对应的仪器。", "明确各日志共用的时间对齐、标识及配置信息。", "定义需保留的原始数据、报告字段和不完整记录处理方式。"], output: "同步证据计划，明确仪器归属和统一记录结构。", note: "时间对齐和软件集成取决于所选工具及接口，不默认具备自动同步。", link: "集成实验室参考架构",
    sourceTitle: "与中国检验认证集团相关的充电测试仪", sourceSummary: "赛特在简短案例说明中将充电测试仪与中国检验认证集团关联。页面未明确设备型号、安装配置、测量流程、验收记录或量化项目成果。", sourceNote: "供应商发布的案例，不作为 APEX 交付或机构背书证明。该关联未经独立核实。",
  },
  "dc-charger-validation-plan": {
    title: "直流充电机验证规划", summary: "将直流充电问题划分为输出行为、充电时序和受控保护响应，为每项拟定检查注明配置与判定规则。",
    requirements: ["定义连接器、通信版本、运行范围和充电设备版本。", "将功能、电气及受控故障检查分配给适用设备。", "记录预期响应、限值、原始测量和待确认排除项。"], output: "区分计划范围、设备和证据的直流验证矩阵。", note: "验证计划不等于已完成测试报告，也不能证明满足所有适用安全要求。", link: "直流充电验证规划指南",
    sourceTitle: "与建材检测集团相关的直流充电测试", sourceSummary: "赛特介绍与中国建材检验认证集团相关的直流充电测试系统，涵盖电流、电压、功率及保护行为。文章未提供配置详情、标准版本或项目原始结果。", sourceNote: "供应商发布的案例，并非 APEX 交付或符合性结论。设备使用情况及结果未经独立核实。",
  },
  "protocol-suite-planning": {
    title: "协议测试用例集规划", summary: "围绕指定实现及明确报文条件构建有边界的协议用例集，将功能通信检查与正式符合性评估区分。",
    requirements: ["明确范围内的协议、版本、实现角色及可选功能。", "明确前提条件、报文变化、时序边界和预期响应。", "为各项检查定义采集拓扑、用例标识和判定证据。"], output: "带版本的协议用例清单，包含可追溯前提条件和判定规则。", note: "协议覆盖及自动化需针对所选实现评审，不代表认证或完整用例集覆盖。", link: "协议测试规划指南",
    sourceTitle: "非车载充电机协议一致性测试", sourceSummary: "赛特在某未具名认证公司案例中概述非车载充电设备通信数据检查和协议行为。说明讨论完整性及稳定性，未发布协议版本、已执行用例或评估证据。", sourceNote: "供应商发布的案例，并非 APEX 交付或符合性结论。测试拓扑、判定标准和实现细节需确认。",
  },
  "ac-dc-measurement-station": {
    title: "交流／直流测量工位规划", summary: "规划共用工作区时不将交流与直流充电视为可互换，分别定义各工位模式的连接方式、被测量和能量处理。",
    requirements: ["列明交流与直流版本、连接额定值及各项测量目的。", "定义各模式专用工装、仪器、联锁及电源或负载配置。", "控制程序选择，并为每项结果记录当前工位配置。"], output: "交流／直流工位配置矩阵，明确各模式职责。", note: "综合工位概念不能证明单台测试仪覆盖所有接口、测量或精度要求。", link: "交流与直流测试比较",
    sourceTitle: "为某机构定制的交流／直流充电测试设备", sourceSummary: "赛特介绍与江苏某未具名机构相关的定制交流及直流充电测试设备。文章讨论电气测量和软件分析，未记录交付配置、仪器精度或验收结果。", sourceNote: "供应商发布的案例，不作为 APEX 交付证明。定制配置、测量性能和验收记录未经独立核实。", alt: "车内装载的便携式充电测试仪、负载和笔记本电脑",
  },
  "charging-site-inspection-plan": {
    title: "充电场站检测计划", summary: "围绕已安装资产、允许的检查和交接或后续处理所需证据划定现场检测边界，避免无边界的全场结论。",
    requirements: ["明确被检资产、连接器、场地条件及访问目的。", "约定安全前提、访问限制及可用的功率吸收设备。", "定义资产级检查、发现项记录和未解决事项的责任归属。"], output: "关联资产的检测清单，包含排除项与问题登记表。", note: "检测计划不能替代现场安全程序，也不构成未检资产的验收。", link: "安装后测试指南",
    sourceTitle: "为某检测公司提供的充电场站测试设备", sourceSummary: "赛特在某未具名第三方检测公司案例中介绍充电场站设备，涵盖电气量、充电行为及维护故障。原文未详述场地条件、所选仪器或某次具体检测记录。", sourceNote: "供应商发布的案例，并非 APEX 交付或检验证书。客户身份、场地范围及实测结果仍未经核实。",
  },
  "custom-dc-test-scope": {
    title: "定制直流测试范围", summary: "将专用直流充电需求转化为可评审规范，区分标准设备功能与工装、软件和外部功率集成。",
    requirements: ["描述充电设备版本、预期检查、运行范围及明确排除项。", "分配定制工装、控制接口、保护及外部设备的职责归属。", "定义验收检查、证据格式及配置变更职责。"], output: "定制范围矩阵，包含可行性问题与验收评审提纲。", note: "所需定制功能在工程评审确认配置与范围之前仍为提案。", link: "测试系统配置指南",
    sourceTitle: "为某检测机构定制的直流充电设备", sourceSummary: "赛特介绍为某未具名第三方检测机构定制的直流充电设备。说明一般性覆盖电气行为及安全检查，未披露定制配置、已执行程序或实测结果。", sourceNote: "供应商发布的案例，不作为 APEX 交付证明。实施条件、客户详情和验收证据未经独立核实。",
  },
  "embedded-end-of-line-planning": {
    title: "嵌入式产线终检规划", summary: "将充电检查纳入生产流程，同时在工位边界保持身份、程序选择和故障处理可追溯。",
    requirements: ["将产品版本及可能的装配或配置故障映射到工位检查。", "定义工装、操作步骤、基准检查及目标节拍预算。", "明确序列号记录、复测授权及拟用的制造数据接口。"], output: "工位流程及追溯结构，包含受控故障和复测路径。", note: "节拍、数据系统集成及自动运行是待评审项目要求，不是已证实的生产结果。", link: "产线测试参考架构",
    sourceTitle: "产线嵌入式充电测试系统", sourceSummary: "赛特介绍将充电检查嵌入制造产线，并把记录与批次或序列号关联。文章讨论追溯及集成概念，未报告实测节拍、精度或验收结果。", sourceNote: "供应商发布的案例，并非 APEX 交付。自动化、AI 及数据系统声明并非经独立核实的生产能力。", alt: "沿装配线布置的测试工位",
  },
  "vehicle-interaction-session-plan": {
    title: "车辆充电交互规划", summary: "围绕待研究接口和状态切换规划车辆端充电会话，区分模拟行为与实际车辆实现。",
    requirements: ["明确车辆端角色、交流或直流接口及软件配置。", "选择连接、就绪、充电、停止和受控异常时序。", "定义各会话需保留的报文、导引状态和电气观察。"], output: "车辆端会话矩阵，包含实现假设与证据要求。", note: "该计划不构成车辆开发系统产品承诺，也不证明兼容未经评审的实现。", link: "车桩协议规划指南",
    sourceTitle: "电动汽车互操作性测试系统", sourceSummary: "赛特概述用于互操作性评估的车辆端交流及直流充电时序和受控故障模拟。说明未明确具体客户、协议版本、已安装设备配置或已执行测试结果。", sourceNote: "供应商发布的应用，并非 APEX 交付或通用兼容性保证。支持的实现及证据需单独确认。",
  },
  "message-validation-planning": {
    title: "充电报文验证规划", summary: "将通信问题转化为明确报文条件、状态依赖和预期反应，使异常响应能够结合上下文进行评审。",
    requirements: ["明确范围内的协议版本、报文字段和实现选项。", "定义有效基准、受控无效条件及时间假设。", "保留报文采集、会话状态及各项计划判定的依据。"], output: "报文验证工作表，包含可复现条件及可评审判定规则。", note: "报文检查仅涵盖所选用例，不能证明完整协议符合性或车辆可靠性。", link: "通信测试规划指南",
    sourceTitle: "电动汽车通信协议一致性测试", sourceSummary: "赛特讨论车辆通信中的充电报文格式、指令处理及错误响应检查。该未具名客户文章描述测试目标，未发布协议版本、用例清单、判定规则或执行记录。", sourceNote: "供应商发布的案例，并非 APEX 交付或已证实可靠性成果。协议范围及实际结果未经独立核实。",
  },
  "automatic-dc-production-planning": {
    title: "直流产线自动化测试规划", summary: "选择自动化方式前，先定义直流充电测试工位应控制、测量和记录的内容，将产线快速判定与详细故障诊断区分。",
    requirements: ["将产品版本映射至测试程序、工装、电气限值和所需操作。", "设定工位前提、时序依赖、停止规则及诊断分流。", "在数据记录中明确测量、软件版本、结果和授权复测。"], output: "自动化需求矩阵，包含工位边界及序列号记录字段。", note: "自动调节、节拍及制造系统接口需单独进行配置与验收评审。", link: "产线终检规划指南",
    sourceTitle: "直流充电产线全功能自动化测试", sourceSummary: "赛特介绍涉及电压、电流、功率和报告生成的直流充电自动化生产检查。未具名客户页面未明确交付工位配置、实测产线吞吐量或有执行记录支持的量化改善。", sourceNote: "供应商发布的案例，并非 APEX 交付。自动调节、吞吐量及集成范围需独立确认配置与成果。",
  },
  "ultrafast-charging-load-planning": {
    title: "超快充负载规划", summary: "评审拟定超快充测试的能量路径，区分所需运行边界与各连接部件的额定值及限制。",
    requirements: ["注明同时施加的电压、电流、峰值及持续工况和切换曲线。", "评审负载容量、供电、回馈许可、电缆、冷却和保护控制。", "定义测量点、运行限制和安全终止条件。"], output: "负载路径与场地清单，包含工况限制及未解决的设备问题。", note: "超快充是规划背景，不是功率额定值声明或已观察到的测试结果；完整能量路径需要评审。", link: "大功率负载规划指南",
    sourceTitle: "为某企业定制的直流超充测试系统", sourceSummary: "赛特介绍与常熟某未具名企业相关的定制超充测试配置，提及仪器、控制器、电源设备和分析软件。说明未证明实际拓扑、额定工况或实测结果。", sourceNote: "供应商发布的案例，并非 APEX 交付或功率能力声明。设备额定值、运行条件和验收证据未经独立核实。",
  },
};

function materialPairs(entry: TechnicalLibraryEntry): Array<[string, string]> {
  const zh = materialTranslations[entry.id];
  if (!zh) return [];
  return [[entry.title, zh.title], [entry.summary, zh.summary], ...entry.requirements.map((text, index): [string, string] => [text, zh.requirements[index]]), [entry.reviewOutput, zh.output], [entry.planningNote, zh.note], [entry.relatedLabel, zh.link], [entry.source.title, zh.sourceTitle], [entry.source.summary, zh.sourceSummary], [entry.source.scopeNote, zh.sourceNote], ...(entry.source.image && zh.alt ? [[entry.source.image.alt, zh.alt] as [string, string]] : [])];
}

export const projectMessages: Record<string, string> = {
  "Project Cases": "项目案例",
  "Engineering references": "工程案例",
  "Technical materials": "技术资料",
  "Engineering references, technical guides and application planning for EV charging test projects.": "面向电动汽车充电测试项目的工程案例、技术指南与应用规划。",
  "Partner-published technical references; not verified APEX delivery records.": "合作方公开技术参考，非经核实的 APEX 交付记录。",
  "Project case collections": "项目案例分类",
  "Related project materials": "相关项目资料",
  "Testing solutions": "测试解决方案",
  "Guide directory": "指南目录",
  "Guide topics": "指南主题",
  "Interfaces": "接口",
  "Charging interfaces": "充电接口",
  "Interfaces & standards": "接口与标准",
  "System selection": "系统选型",
  "Laboratory & production": "实验室与生产",
  "Field & commissioning": "现场与调试",
  "Energy integration": "能源集成",
  "Vehicle Manufacturers": "车企",
  "Certification Bodies": "认证机构",
  "Government Agencies": "政府机构",
  "Charger Manufacturers": "桩企",
  "Engineering case references": "工程案例参考",
  "Engineering case category": "工程案例分类",
  "Engineering reference results": "工程案例结果",
  "All cases": "全部案例",
  "All references": "全部参考",
  "Search engineering references": "搜索工程案例",
  "Search cases": "搜索案例",
  "Technical details:": "技术详情：",
  "Technical scope": "技术范围",
  "Technical focus": "技术重点",
  "Related testing guide": "相关测试指南",
  "Discuss a similar configuration": "咨询类似配置",
  "Reference scenario. Final configuration is subject to engineering review.": "参考场景，最终配置需经工程评审。",
  "No matching references": "未找到匹配案例",
  "No engineering reference matches this search and category.": "此搜索及分类下没有匹配的工程案例。",
  "Resource materials": "技术资料",
  "Technical library materials": "技术资料库",
  "All materials": "所有资料",
  "Guides": "指南",
  "Solution briefs": "解决方案简介",
  "Applications": "应用规划",
  "Application": "应用规划",
  "Application scenarios": "应用场景",
  "Solutions": "解决方案",
  "Material type": "资料类型",
  "Technical guide": "技术指南",
  "Solution brief": "解决方案简介",
  "Planning materials": "规划资料",
  "Remove planning materials filter": "移除规划资料筛选",
  "Topic": "主题",
  "All topics": "所有主题",
  "Search materials": "搜索资料",
  "Testing topic or requirement": "测试主题或需求",
  "Category": "分类",
  "All categories": "所有分类",
  "Resource results": "资料结果",
  "No matching materials": "未找到匹配资料",
  "No material matches this search and category.": "此搜索及分类下没有匹配的资料。",
  "No brief matches this topic and category.": "此主题及分类下没有匹配的简介。",
  "Reset filters": "重置筛选",
  "Material details:": "资料详情：",
  "Material details": "资料详情",
  "Read the guide": "阅读指南",
  "Planning checklist": "规划清单",
  "Requirements to confirm": "待确认需求",
  "Review output": "评审输出",
  "Scope:": "范围：",
  "Technical context": "技术背景",
  "EVSE laboratory": "充电设备实验室",
  "Vehicle interaction": "车辆交互",
  "PV and storage": "光伏与储能",
  "Battery and power interfaces": "电池与功率接口",
  "Field diagnostics": "现场诊断",
  "Custom integration": "定制集成",
  "Vehicle engineering": "车辆工程",
  "Independent testing": "独立检测",
  "Public inspection": "公共检测",
  "Charger manufacturing": "充电设备制造",
  ...Object.fromEntries(engineeringCases.flatMap((entry): Array<[string, string]> => {
    const zh = caseTranslations[entry.id];
    if (!zh) return [];
    return [[entry.title, zh.title], [entry.summary, zh.summary], ...entry.technicalFocus.map((text, index): [string, string] => [text, zh.focus[index]]), ...(entry.image ? [[entry.image.alt, zh.alt] as [string, string]] : [])];
  })),
  ...Object.fromEntries([...solutionBriefs, ...applicationScenarios].flatMap(materialPairs)),
};
