// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const languageBtn = document.getElementById('languageBtn');
    const languageText = languageBtn.querySelector('span');
    
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    updateLanguage(savedLanguage);
    
    // Toggle language on button click
    languageBtn.addEventListener('click', function() {
        const currentLanguage = localStorage.getItem('language') || 'en';
        const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
        updateLanguage(newLanguage);
    });
    
    function updateLanguage(language) {
        // Save language preference
        localStorage.setItem('language', language);
        
        // Update button text
        languageText.textContent = language === 'en' ? 'English' : 'العربية';
        
        // Update page direction
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        
        // Update font family for Arabic
        if (language === 'ar') {
            document.documentElement.style.fontFamily = "'Cairo', sans-serif";
        } else {
            document.documentElement.style.fontFamily = "'Space Grotesk', sans-serif";
        }
        
        // Here you would typically load the translated content
        // This would require a translation system or API
        // For now, we'll just update the button text
    }
}); 