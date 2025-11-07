// backup-manager.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class BackupManager {
    constructor() {
        this.backupDir = path.join(__dirname, 'backups');
        this.ensureBackupDir();
    }

    // ایجاد پوشه بکاپ اگر وجود ندارد
    ensureBackupDir() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
            console.log('✅ پوشه بکاپ ایجاد شد:', this.backupDir);
        }
    }

    // ایجاد بکاپ از فایل
    createBackup(sourceFile, backupName = null) {
        return new Promise((resolve, reject) => {
            const timestamp = new Date().toISOString()
                .replace(/[:.]/g, '-')
                .replace('T', '_')
                .split('.')[0];
            
            const fileName = path.basename(sourceFile);
            const backupFileName = backupName || 
                `${fileName.replace('.js', '')}-backup-${timestamp}.js`;
            
            const backupPath = path.join(this.backupDir, backupFileName);

            // کپی فایل
            fs.copyFile(sourceFile, backupPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`✅ بکاپ ایجاد شد: ${backupPath}`);
                    resolve(backupPath);
                }
            });
        });
    }

    // بکاپ از کل پروژه
    async backupProject() {
        const timestamp = new Date().toISOString()
            .replace(/[:.]/g, '-')
            .replace('T', '_')
            .split('.')[0];
        
        const backupFolder = path.join(this.backupDir, `project-backup-${timestamp}`);
        
        if (!fs.existsSync(backupFolder)) {
            fs.mkdirSync(backupFolder, { recursive: true });
        }

        const filesToBackup = [
            'complete-server.js',
            'server.js',
            'server-new.js',
            'package.json',
            'TourismService.js'
        ];

        let backedUpFiles = 0;

        for (const file of filesToBackup) {
            const sourcePath = path.join(__dirname, file);
            if (fs.existsSync(sourcePath)) {
                const destPath = path.join(backupFolder, file);
                fs.copyFileSync(sourcePath, destPath);
                backedUpFiles++;
                console.log(`✅ ${file} بکاپ شد`);
            }
        }

        // بکاپ از پوشه modules
        const modulesDir = path.join(__dirname, 'modules');
        if (fs.existsSync(modulesDir)) {
            const modulesBackupDir = path.join(backupFolder, 'modules');
            this.copyFolderRecursive(modulesDir, modulesBackupDir);
            console.log('✅ پوشه modules بکاپ شد');
        }

        console.log(`🎉 بکاپ پروژه کامل شد! ${backedUpFiles} فایل ذخیره شد`);
        return backupFolder;
    }

    // کپی recursive پوشه
    copyFolderRecursive(source, target) {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
        }

        const files = fs.readdirSync(source);
        
        for (const file of files) {
            const sourcePath = path.join(source, file);
            const targetPath = path.join(target, file);
            
            if (fs.statSync(sourcePath).isDirectory()) {
                this.copyFolderRecursive(sourcePath, targetPath);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
            }
        }
    }

    // لیست بکاپ‌های موجود
    listBackups() {
        if (!fs.existsSync(this.backupDir)) {
            return [];
        }

        const items = fs.readdirSync(this.backupDir);
        const backups = items.filter(item => {
            const itemPath = path.join(this.backupDir, item);
            return fs.statSync(itemPath).isDirectory() || item.includes('-backup-');
        });

        return backups.sort().reverse();
    }

    // بازیابی بکاپ
    restoreBackup(backupName) {
        const backupPath = path.join(this.backupDir, backupName);
        
        if (!fs.existsSync(backupPath)) {
            throw new Error(`بکاپ یافت نشد: ${backupName}`);
        }

        if (fs.statSync(backupPath).isDirectory()) {
            // بازیابی کل پروژه
            this.restoreProjectBackup(backupPath);
        } else {
            // بازیابی فایل واحد
            const fileName = path.basename(backupPath).replace(/-backup-.*\.js$/, '.js');
            const restorePath = path.join(__dirname, fileName);
            fs.copyFileSync(backupPath, restorePath);
            console.log(`✅ فایل بازیابی شد: ${fileName}`);
        }
    }

    restoreProjectBackup(backupPath) {
        const files = fs.readdirSync(backupPath);
        
        for (const file of files) {
            const sourcePath = path.join(backupPath, file);
            const targetPath = path.join(__dirname, file);
            
            if (fs.statSync(sourcePath).isDirectory()) {
                this.copyFolderRecursive(sourcePath, targetPath);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
            }
        }
        
        console.log(`✅ پروژه از بکاپ بازیابی شد: ${path.basename(backupPath)}`);
    }
}

module.exports = BackupManager;
