import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// נתיב תיקיית הקבצים
const localesDir = path.join(__dirname, '../../../../locales');

export type ContentType = 'i18n' | 'media';

export class ContentService {
  private getFilePath(type: ContentType, lang?: string): string {
    if (type === 'i18n') {
      if (!lang) throw new Error('Language is required for i18n');
      return path.join(localesDir, `${lang}.json`);
    } else if (type === 'media') {
      return path.join(localesDir, `media.json`);
    }
    throw new Error('Unknown content type');
  }

  public async getContent(type: ContentType, lang?: string): Promise<any> {
    const filePath = this.getFilePath(type, lang);
    if (!fs.existsSync(filePath)) throw new Error('File not found');

    try {
      const buffer = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(buffer);
    } catch (err) {
      console.error(`❌ Error reading ${type} file:`, err);
      throw new Error(`Failed to load ${type} data`);
    }
  }

  public async updateContent(
    type: ContentType,
    data: any,
    adminEmail: string,
    lang?: string
  ) {
    const filePath = this.getFilePath(type, lang);
    const tempPath = filePath + '.tmp';

    try {
      console.log(`🔄 Updating ${type}...`);
      await fs.promises.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');

       const buildOk = await this.checkBuild();
       if (!buildOk) throw new Error('Build failed');

      await fs.promises.copyFile(tempPath, filePath);

       await this.gitPushChanges(filePath, type, adminEmail);

      await fs.promises.unlink(tempPath);
      return { success: true };
    } catch (err) {
      console.error(`❌ Failed updating ${type}:`, err);
      await fs.promises.unlink(tempPath).catch(() => {});
      throw new Error('שגיאה בשמירת השינויים – הפעולה בוטלה');
    }
  }

  public async backupContent(type: ContentType, lang?: string) {
    const filePath = this.getFilePath(type, lang);
    const backupFile = `${type}_backup_${Date.now()}.json`;
    const backupPath = path.join(localesDir, backupFile);

    if (!fs.existsSync(filePath)) throw new Error('File not found');
    fs.copyFileSync(filePath, backupPath);
    return { success: true, backup: backupPath };
  }

  private async checkBuild(): Promise<boolean> {
    try {
      const { stderr } = await execAsync('npm run build', {
        cwd: process.cwd(),
        timeout: 60000,
      });
      if (stderr && !stderr.includes('warning')) {
        console.error('❌ Build stderr:', stderr);
        return false;
      }
      return true;
    } catch (err) {
      console.error('❌ Build failed:', err);
      return false;
    }
  }

  private async gitPushChanges(filePath: string, type: string, adminEmail: string) {
    console.log('🔄 Pushing changes to git...');
    const gitCommands = [
      `git add "${filePath}"`,
      `git commit -m "${type} update by ${adminEmail} - ${new Date().toISOString()}"`,
      `git push origin main`,
    ];

    for (const command of gitCommands) {
      try {
        await execAsync(command, { cwd: process.cwd(), timeout: 15000 });
      } catch (err) {
        console.error(`❌ Git command failed (${command}):`, err);
        throw new Error(`Git command failed: ${command}`);
      }
    }
    console.log('✅ Git push successful!');
  }
}
