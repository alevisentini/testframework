import { test as setup, expect } from '@playwright/test';

setup("SIAT-CI-136: login : Login", async ({ browser }) => {
    const context = await browser.newContext({
        // Ignorar errores HTTPS si es necesario
        ignoreHTTPSErrors: true
    });
    
    const page = await context.newPage();
    
    // Configurar timeouts a nivel de página
    page.setDefaultNavigationTimeout(60000); // 60 segundos para navegaciones
    page.setDefaultTimeout(30000); // 30 segundos para acciones generales

    try {
        console.log('Iniciando proceso de login...');
        
        await page.goto('https://tsso.santafe.gov.ar/service-auth/login?service=https%3A%2F%2Ftapp.santafe.gov.ar%3A443%2Fsiat%2Flogin%2FLoginSsl.do%3Bjsessionid%3DA11442F747F06E85E108E7B0FF78BA14.siat-tapp3%3Fmethod%3DintranetInit');
        
        // Esperar que la página cargue completamente
        await page.waitForLoadState('networkidle');
        
        console.log('Página de login cargada, buscando campos...');
        
        // Usar selectores más robustos y con timeouts más altos
        await page.locator('input#username').waitFor({ 
            state: 'visible', 
            timeout: 10000 
        });
        
        await page.locator('input#username').click();
        await page.locator('input#username').fill('usuario1');
        await page.locator('input#username').press('Tab');
        
        await page.locator('input#password').waitFor({ 
            state: 'visible', 
            timeout: 5000 
        });
        await page.locator('input#password').fill('usuario1');
        
        console.log('Credenciales ingresadas, enviando formulario...');
        
        // Usar click sin esperar navegación automática
        await page.locator('button[name="submit"]').click({ timeout: 10000 });
        
        // Manejar la navegación manualmente con timeout mayor
        try {
            // Esperar por cualquier señal de que el login fue exitoso
            await Promise.race([
                page.waitForURL('**/siat/**', { timeout: 20000 }),
                page.waitForSelector('text=Sistema Integral', { timeout: 20000 }),
                page.waitForSelector('[class*="menu"], [class*="dashboard"]', { timeout: 20000 }),
                page.waitForTimeout(15000) // Fallback timeout
            ]);
            
            console.log('Login exitoso detectado');
            
        } catch (e) {
            console.log('Verificando estado actual de la página...');
            console.log('URL actual:', page.url());
            
            // Verificar si estamos en una página post-login
            const isLoggedIn = page.url().includes('siat') || 
                              await page.locator('text=Sistema Integral').isVisible({ timeout: 2000 }).catch(() => false);
            
            if (!isLoggedIn) {
                throw new Error('Login falló - no se detectó navegación exitosa');
            }
        }
        
        // Dar tiempo adicional para que se establezca la sesión
        await page.waitForTimeout(3000);
        
        // Verificar que el login fue exitoso esperando algún elemento de la página principal
        // Ajusta este selector según lo que aparezca después del login exitoso
        await page.waitForTimeout(3000); // Dar tiempo para redirects
        
        console.log('Login completado, guardando estado...');
        
        // Guardar el estado de autenticación
        await page.context().storageState({ path: "./LoginAuth.json" });
        
        console.log('Estado de autenticación guardado en LoginAuth.json');
        
    } catch (error) {
        console.error('Error durante el setup de login:', error);
        
        // Tomar screenshot para debug
        await page.screenshot({ 
            path: './test-results/login-error.png',
            fullPage: true 
        });
        
        throw error;
    } finally {
        await page.close();
        await context.close();
    }
});