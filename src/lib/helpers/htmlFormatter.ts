function htmlToFormattedText(html: string): string {
    if (!html || typeof html !== 'string') {
        return '';
    }

    try {
        let text = html;


        text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n=== $1 ===\n\n');
        text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n## $1 ##\n\n');
        text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n# $1 #\n\n');
        text = text.replace(/<h[4-6][^>]*>(.*?)<\/h[4-6]>/gi, '\n\n$1\n\n');


        text = text.replace(/<p[^>]*>/gi, '\n');
        text = text.replace(/<\/p>/gi, '\n\n');


        text = text.replace(/<br\s*\/?>/gi, '\n');


        text = html.replace(/<\/?ul[^>]*>/g, '');

        text = text.replace(/<li><p>/g, '• ');
        text = text.replace(/<\/p><\/li>/g, '\n\n');

        text = text.replace(/<\/?[^>]+(>|$)/g, '');


        let olCounter = 0;
        text = text.replace(/<ol[^>]*>/gi, () => {
            olCounter = 0;
            return '\n';
        });
        text = text.replace(/<\/ol>/gi, '\n');
        text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, (match, content) => {
            olCounter++;
            return `${olCounter}. ${content}\n`;
        });


        text = text.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**');


        text = text.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*');


        text = text.replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_');


        text = text.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n');
        text = text.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');


        text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n');


        text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)');


        text = text.replace(/<hr\s*\/?>/gi, '\n---\n');


        text = text.replace(/<\/?div[^>]*>/gi, '\n');
        text = text.replace(/<\/?span[^>]*>/gi, '');


        text = text.replace(/<\/?[^>]+(>|$)/g, '');


        text = text
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&rsquo;/g, "'")
            .replace(/&lsquo;/g, "'")
            .replace(/&rdquo;/g, '"')
            .replace(/&ldquo;/g, '"');


        text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
        text = text.replace(/[ \t]+/g, ' ');
        text = text.trim();

        return text;
    } catch (error) {
        console.error('Error converting HTML to text:', error);
        return '';
    }
}

export { htmlToFormattedText };