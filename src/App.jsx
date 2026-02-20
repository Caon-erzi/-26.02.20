import React, { useState, useMemo } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Trash2, Plus, Activity, Target } from 'lucide-react';

const defaultSteps = [
  { id: 1, name: '发酵收获液 (Harvest)', inVol: 2000, inConc: 5.0, outVol: 1950, outConc: 4.8 },
  { id: 2, name: '亲和层析 (Protein A)', inVol: '', inConc: '', outVol: 80, outConc: 108.0 },
  { id: 3, name: '低pH病毒灭活 (Low pH VI)', inVol: '', inConc: '', outVol: 85, outConc: 101.5 },
  { id: 4, name: '阳离子交换层析 (CEX)', inVol: '', inConc: '', outVol: 200, outConc: 41.0 },
  { id: 5, name: '阴离子交换层析 (AEX)', inVol: '', inConc: '', outVol: 220, outConc: 35.8 },
  { id: 6, name: '病毒过滤 (VF)', inVol: '', inConc: '', outVol: 240, outConc: 32.5 },
  { id: 7, name: '超滤/洗滤 (UF/DF)', inVol: '', inConc: '', outVol: 100, outConc: 75.0 },
  { id: 8, name: '原液配制 (BDS)', inVol: '', inConc: '', outVol: 102, outConc: 72.8 }
];

const StepCard = ({ step, index, updateStep, removeStep, isFirst, isLast, prevStepOutMass }) => {

  const inMass = isFirst ? ((step.inVol || 0) * (step.inConc || 0)) : prevStepOutMass;
  const outMass = (step.outVol || 0) * (step.outConc || 0);

  const yieldPct = inMass > 0 ? ((outMass / inMass) * 100) : 0;

  const handleStepChange = (field, value) => {
    const num = parseFloat(value);
    updateStep(step.id, field, value === '' ? '' : (isNaN(num) ? '' : num));
  };

  const formatNum = (num) => typeof num === 'number' ? num.toFixed(2) : '0.00';

  return (
    <div className="relative z-10 glass-panel rounded-xl p-6 mb-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(56,189,248,0.25)] flex flex-col md:flex-row gap-6 items-center">

      <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#38bdf8] flex items-center justify-center font-bold text-xl md:text-2xl glow-text bg-[#0f172a] shadow-[0_0_15px_rgba(56,189,248,0.4)]">
        {index + 1}
      </div>

      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        <div className="lg:col-span-1 flex flex-col justify-center">
          <label className="text-xs text-[--text-secondary] uppercase tracking-wider mb-1">步骤名称</label>
          <input
            type="text"
            value={step.name}
            onChange={(e) => updateStep(step.id, 'name', e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-lg font-semibold"
          />
        </div>

        <div className="lg:col-span-1 bg-[rgba(15,23,42,0.4)] p-4 rounded-lg border border-[rgba(255,255,255,0.05)]">
          <h4 className="text-sm font-semibold mb-3 text-[--text-secondary] flex items-center gap-2">
            <ArrowDownToLine className="w-4 h-4" /> 上样 (Input)
          </h4>
          {isFirst ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">初始体积 (L)</label>
                <input type="number" step="any" value={step.inVol === '' ? '' : step.inVol} onChange={e => handleStepChange('inVol', e.target.value)} className="w-full px-2 py-1.5 rounded number-font" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">初始浓度 (g/L)</label>
                <input type="number" step="any" value={step.inConc === '' ? '' : step.inConc} onChange={e => handleStepChange('inConc', e.target.value)} className="w-full px-2 py-1.5 rounded number-font" />
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2 h-full flex flex-col justify-center">
              <div className="text-xs text-gray-400 mb-1">承接上一步总质量:</div>
              <div className="text-2xl font-bold number-font text-white">
                {formatNum(prevStepOutMass)} <span className="text-sm text-gray-500 font-normal">g</span>
              </div>
              <div className="text-[10px] text-[--text-secondary] mt-2 leading-tight">
                中间步骤输入质量默认等于上游步骤输出质量。
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 bg-[rgba(15,23,42,0.4)] p-4 rounded-lg border border-[rgba(255,255,255,0.05)]">
          <h4 className="text-sm font-semibold mb-3 text-[--text-secondary] flex items-center gap-2">
            <ArrowUpFromLine className="w-4 h-4" /> 收集池 (Pool/Output)
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">体积 (L)</label>
              <input type="number" step="any" value={step.outVol === '' ? '' : step.outVol} onChange={e => handleStepChange('outVol', e.target.value)} className="w-full px-2 py-1.5 rounded number-font" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">浓度 (g/L)</label>
              <input type="number" step="any" value={step.outConc === '' ? '' : step.outConc} onChange={e => handleStepChange('outConc', e.target.value)} className="w-full px-2 py-1.5 rounded number-font" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col justify-center items-center bg-gradient-to-br from-[rgba(56,189,248,0.05)] to-[rgba(139,92,246,0.05)] p-4 rounded-lg border border-[rgba(56,189,248,0.15)] relative overflow-hidden">
          {/* Process completion indicator background */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-1000" style={{ width: `${Math.min(yieldPct, 100)}%` }}></div>

          <div className="text-xs text-[--text-secondary] mb-2 uppercase tracking-wide">本步收率 (Step Yield)</div>
          <div className={`text-4xl lg:text-5xl font-bold number-font ${yieldPct >= 85 ? 'text-green-400' : yieldPct >= 70 ? 'text-yellow-400' : 'text-red-400'} glow-text`}>
            {formatNum(yieldPct)}<span className="text-xl lg:text-2xl">%</span>
          </div>
          <div className="text-sm text-gray-300 mt-3 pt-2 border-t border-[rgba(255,255,255,0.1)] w-full text-center">
            产出: <span className="number-font text-white">{formatNum(outMass)}</span> g
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col gap-2 absolute top-4 right-4 md:static">
        <button onClick={() => removeStep(step.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition" title="删除当前步骤">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [steps, setSteps] = useState(defaultSteps);

  const updateStep = (id, field, value) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeStep = (id) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const addStep = () => {
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1;
    setSteps([...steps, { id: newId, name: '新增工艺步骤', inVol: '', inConc: '', outVol: '', outConc: '' }]);
  };

  const { overallYield, totalInputMass, totalOutputMass } = useMemo(() => {
    if (steps.length === 0) return { overallYield: 0, totalInputMass: 0, totalOutputMass: 0 };
    const first = steps[0];
    const last = steps[steps.length - 1];

    const inputMass = (first.inVol || 0) * (first.inConc || 0);
    const outputMass = (last.outVol || 0) * (last.outConc || 0);

    return {
      totalInputMass: inputMass,
      totalOutputMass: outputMass,
      overallYield: inputMass > 0 ? (outputMass / inputMass) * 100 : 0
    };
  }, [steps]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 relative min-h-screen flex flex-col">

      <header className="mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[rgba(56,189,248,0.2)] to-[rgba(139,92,246,0.2)] rounded-2xl border border-[rgba(56,189,248,0.4)] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Activity className="w-8 h-8 md:w-10 md:h-10 text-[#38bdf8] flex-shrink-0" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 glow-text leading-tight">
              抗体原液<br className="hidden md:block" />工艺收率分析器
            </span>
          </h1>
          <p className="text-[--text-secondary] text-sm md:text-base max-w-xl bg-black/20 p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
            mAb Downstream Process Yield Calculator. <br />输入关键单元操作的体积与浓度，自动追踪流转质量计算各步骤收率与整体工艺收率。
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 border-b-4 border-b-[#38bdf8] min-w-[320px] shadow-[0_10px_40px_rgba(56,189,248,0.15)] transform hover:scale-105 transition-transform">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#38bdf8] mb-1 font-semibold">Overall Yield</div>
            <div className="text-sm text-gray-400 mb-2">整体工艺累积收率</div>
            <div className="text-5xl md:text-6xl font-bold number-font text-white glow-text">
              {overallYield.toFixed(2)}<span className="text-2xl text-[#38bdf8]">%</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 border-l border-[rgba(255,255,255,0.1)] pl-6">
            <div>
              <div className="text-[10px] uppercase text-gray-500">Total Input</div>
              <div className="text-lg number-font font-medium text-gray-200">{totalInputMass.toFixed(1)} <span className="text-xs">g</span></div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-gray-500">Total Output</div>
              <div className="text-lg number-font font-medium text-[#10b981]">{totalOutputMass.toFixed(1)} <span className="text-xs">g</span></div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex-grow">
        <div className="hidden lg:block absolute left-[1.875rem] top-8 bottom-12 w-1 bg-gradient-to-b from-[#38bdf8] via-indigo-500 to-transparent opacity-30 rounded-full z-0"></div>

        <div className="space-y-2">
          {steps.map((step, index) => {
            let prevOutMass = 0;
            if (index > 0) {
              const prevStep = steps[index - 1];
              prevOutMass = (prevStep.outVol || 0) * (prevStep.outConc || 0);
            }

            return (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                updateStep={updateStep}
                removeStep={removeStep}
                isFirst={index === 0}
                isLast={index === steps.length - 1}
                prevStepOutMass={prevOutMass}
              />
            );
          })}
        </div>

        <div className="relative z-10 flex justify-center mt-10">
          <button
            onClick={addStep}
            className="group relative px-8 py-4 bg-gradient-to-r from-[rgba(56,189,248,0.1)] to-[rgba(139,92,246,0.1)] hover:from-[rgba(56,189,248,0.2)] hover:to-[rgba(139,92,246,0.2)] border border-[rgba(56,189,248,0.4)] text-[#38bdf8] rounded-2xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(56,189,248,0.1)] hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            <div className="bg-[#38bdf8]/20 p-1.5 rounded-full">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg">添加新步骤 (Add Step)</span>
          </button>
        </div>
      </main>

      <footer className="mt-20 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-center text-sm text-[--text-secondary] gap-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <span>基于质量守恒 (Mass Balance) 计算体系</span>
        </div>
        <div>
          <p>© {new Date().getFullYear()} Downstream Process Engineering Analytics.</p>
        </div>
      </footer>
    </div>
  );
}
