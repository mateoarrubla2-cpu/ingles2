# 🚀 GitHub Pages Deployment - Instrucciones

Tu aplicación ha sido pusheada a GitHub y está lista para desplegarse en GitHub Pages.

## 📍 URL de tu repositorio:
```
https://github.com/mateoarrubla2-cpu/ingles2
```

## 🔧 Configurar GitHub Pages

### Opción 1: Automática (Recomendado)
1. Ve a tu repositorio en GitHub: https://github.com/mateoarrubla2-cpu/ingles2
2. Ve a **Settings** (Configuración)
3. En la barra lateral izquierda, busca y haz clic en **Pages**
4. Bajo "Build and deployment":
   - **Source**: Selecciona `Deploy from a branch`
   - **Branch**: Selecciona `gh-pages`
   - **Folder**: Mantén `/root`
5. Haz clic en **Save**

GitHub Pages ahora desplegará automáticamente tu aplicación.

### ⏳ Tiempo de espera
- La primera vez puede tardar 1-5 minutos
- Verás una notificación cuando esté lista

## 📱 Accede a tu aplicación

Una vez desplegada, tu app estará disponible en:
```
https://mateoarrubla2-cpu.github.io/ingles2/
```

(Reemplaza `mateoarrubla2-cpu` con tu usuario de GitHub si es diferente)

## ✅ Verificar estado

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** > **Pages**
3. Busca el mensaje: "Your site is published at: [URL]"

## 📤 Actualizar la aplicación

Para subir nuevos cambios:

```bash
# 1. Hacer cambios en index.html o db.json
# 2. Stage los cambios
git add .

# 3. Crear un commit
git commit -m "Descripción de los cambios"

# 4. Push a GitHub
git push origin main

# 5. Si ya configuraste gh-pages:
git push origin gh-pages
```

O más rápido, usa este comando una sola vez:
```bash
git push origin main gh-pages
```

## 🔄 Sincronizar gh-pages con main

Para mantener gh-pages actualizada con los cambios de main:

```bash
# Asegúrate de estar en main
git checkout main

# Úbicate en gh-pages
git checkout gh-pages

# Merge los cambios de main
git merge main

# Push
git push origin gh-pages

# Vuelve a main
git checkout main
```

## 📋 Resumen de ramas

- **main**: Tu código fuente principal
- **gh-pages**: Rama que GitHub Pages sirve al público

Ambas tienen el mismo contenido actualmente.

## 🆘 Problemas comunes

### No aparece la página
- Espera 5 minutos
- Verifica que la rama `gh-pages` está creada
- Recarga con Ctrl+F5 (caché)

### La aplicación se ve bien pero los datos no cargan
- Es normal, los datos se guardan en localStorage del navegador
- Están locales en tu máquina, no en el servidor

### Quiero cambiar la rama de deploy
- Ve a Settings > Pages
- Cambia la rama a `main` si prefieres

---

**¡Tu aplicación está deploytada en GitHub Pages! 🎉**

URL publicada: https://mateoarrubla2-cpu.github.io/ingles2/

