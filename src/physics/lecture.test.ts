import { describe, expect, it } from 'vitest';
import { blochTrajectory, dft, diffusionSignal, gaussianConvolution, inverseDft, linewidthHz, lorentzAbsorption, phaseContrast } from './lecture';

describe('lecture experiments',()=>{
  it('reproduces resonant 90° and 180° rotations in the no-relaxation limit',()=>{
    const pulse90 = blochTrajectory(90,0,1e10,1e10,2,2).slice(-1)[0].m;
    const pulse180 = blochTrajectory(180,0,1e10,1e10,2,2).slice(-1)[0].m;
    expect(pulse90[1]).toBeCloseTo(1,5); expect(pulse90[2]).toBeCloseTo(0,5);
    expect(pulse180[2]).toBeCloseTo(-1,5); expect(pulse180[1]).toBeCloseTo(0,5);
  });
  it('matches analytic free relaxation after the finite pulse',()=>{
    const trajectory = blochTrajectory(90,0,600,80);
    const start = trajectory.find(p=>Math.abs(p.t-2)<1e-8)!.m;
    const end = trajectory.slice(-1)[0].m;
    expect(end[1]).toBeCloseTo(start[1]*Math.exp(-398/80),5);
    expect(end[2]).toBeCloseTo(1-(1-start[2])*Math.exp(-398/600),5);
  });
  it('round-trips arbitrary samples through complex DFT and inverse DFT',()=>{
    const samples=Array.from({length:64},(_,i)=>Math.sin(i*0.35)+0.2*Math.cos(i*1.1));
    inverseDft(dft(samples)).forEach((v,i)=>expect(v).toBeCloseTo(samples[i],10));
    const bin3=dft(Array.from({length:64},(_,i)=>Math.sin(2*Math.PI*3*i/64)));
    expect(bin3[3].im/64).toBeCloseTo(-0.5,10); expect(bin3[2].magnitude).toBeLessThan(1e-10);
  });
  it('convolution preserves DC and agrees with the convolution theorem',()=>{
    const n=64, input=Array.from({length:n},(_,i)=>Math.cos(2*Math.PI*3*i/n));
    const kernel=Array.from({length:n},(_,i)=>Math.exp(-(Math.min(i,n-i)**2)/8));
    const sum=kernel.reduce((s,v)=>s+v,0), h=dft(kernel.map(v=>v/sum)), x=dft(input), y=dft(gaussianConvolution(input,2));
    y.forEach((v,k)=>{ expect(v.re).toBeCloseTo(x[k].re*h[k].re-x[k].im*h[k].im,8); expect(v.im).toBeCloseTo(x[k].re*h[k].im+x[k].im*h[k].re,8); });
    gaussianConvolution(Array(n).fill(2),3).forEach(v=>expect(v).toBeCloseTo(2,10));
  });
  it('uses absorptive linewidth with half height at ±FWHM/2',()=>{
    expect(linewidthHz(80)).toBeCloseTo(linewidthHz(40)/2,10);
    expect(lorentzAbsorption(linewidthHz(80)/2,0,80)).toBeCloseTo(0.5,10);
  });
  it('wraps velocity only outside the selected VENC interval',()=>{
    expect(phaseContrast(120,80).measured).toBeCloseTo(-40,8);
    expect(phaseContrast(120,80).aliased).toBe(true);
    expect(phaseContrast(120,150).measured).toBeCloseTo(120,8);
    expect(phaseContrast(-50,100).measured).toBeCloseTo(-50,8);
  });
  it('is isotropic when eigenvalues agree and attenuates more along a fiber',()=>{
    expect(diffusionSignal(1000,0,0.001,0.001).signal).toBeCloseTo(diffusionSignal(1000,90,0.001,0.001).signal,10);
    expect(diffusionSignal(1000,0,0.0017,0.0003).signal).toBeLessThan(diffusionSignal(1000,90,0.0017,0.0003).signal);
    expect(diffusionSignal(0,55,0.0017,0.0003).signal).toBe(1);
  });
});
