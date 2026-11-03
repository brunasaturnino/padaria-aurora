import { describe, expect, it } from 'vitest';
import { parseReaisToCents } from './money';

describe('leitura de reais', () => {
  it('lê um valor inteiro', () => {
    expect(parseReaisToCents('10')).toBe(1000);
  });

  it('lê uma casa decimal com vírgula', () => {
    expect(parseReaisToCents('10,5')).toBe(1050);
  });

  it('lê duas casas decimais', () => {
    expect(parseReaisToCents('10,50')).toBe(1050);
  });

  it('aceita o símbolo e o milhar brasileiro', () => {
    expect(parseReaisToCents('R$ 1.234,56')).toBe(123456);
  });

  it('trata ponto de milhar sem vírgula', () => {
    expect(parseReaisToCents('1.234')).toBe(123400);
  });

  it('aceita ponto como separador decimal', () => {
    expect(parseReaisToCents('10.50')).toBe(1050);
  });

  it('rejeita campo vazio', () => {
    expect(() => parseReaisToCents('   ')).toThrow('Informe um valor em reais.');
  });

  it('rejeita um símbolo sem número', () => {
    expect(() => parseReaisToCents('R$')).toThrow('Informe um valor em reais.');
  });

  it('rejeita texto', () => {
    expect(() => parseReaisToCents('abc')).toThrow('Use um valor como 12,50.');
  });

  it('rejeita valor negativo', () => {
    expect(() => parseReaisToCents('-2')).toThrow('não pode ser negativo');
  });

  it('rejeita mais de duas casas decimais', () => {
    expect(() => parseReaisToCents('10,505')).toThrow('Use um valor como 12,50.');
  });
});
