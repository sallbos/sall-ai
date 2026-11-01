/**
 * MR.SALL AI — Cybersecurity Learning, Glossary & Security Utilities
 * Strictly educational and hardening-oriented
 */

export class CyberUtils {
  /**
   * Educational Glossary of 50+ Key Cybersecurity Terms
   */
  static getGlossary() {
    return [
      {
        term: 'Zero Trust Architecture',
        category: 'Architecture',
        definition: 'A strategic security model that assumes every entity is hostile and requires continuous verification for all access requests, adhering to the principle: "Never trust, always verify."'
      },
      {
        term: 'Multi-Factor Authentication (MFA)',
        category: 'Identity',
        definition: 'An electronic authentication method where access is granted only after successfully presenting two or more pieces of evidence from different categories (knowledge, possession, inherence).'
      },
      {
        term: 'Public Key Cryptography (Asymmetric)',
        category: 'Cryptography',
        definition: 'A cryptographic system that uses pairs of keys: public keys which may be disseminated widely, and private keys which are known only to the owner.'
      },
      {
        term: 'Transport Layer Security (TLS 1.3)',
        category: 'Network',
        definition: 'A cryptographic protocol designed to provide secure end-to-end communication over the Internet, preventing eavesdropping and tampering.'
      },
      {
        term: 'Cross-Site Scripting (XSS)',
        category: 'Web Security',
        definition: 'A client-side code injection attack where malicious scripts are injected into otherwise trusted websites viewed by other users. Defended by robust output encoding and CSP headers.'
      },
      {
        term: 'Cross-Site Request Forgery (CSRF)',
        category: 'Web Security',
        definition: 'An attack that tricks a victim into executing unwanted actions on an authenticated web application. Mitigated via SameSite cookies and anti-CSRF challenge tokens.'
      },
      {
        term: 'SQL Injection (SQLi)',
        category: 'Web Security',
        definition: 'A vulnerability where malicious SQL queries are inserted into input fields. Prevented by using parameterized queries and prepared statements.'
      },
      {
        term: 'Content Security Policy (CSP)',
        category: 'Web Security',
        definition: 'An HTTP response header that restricts where resources (scripts, styles, images) can be loaded from, effectively preventing XSS attacks.'
      },
      {
        term: 'Shannon Entropy',
        category: 'Cryptography',
        definition: 'A mathematical measure of uncertainty and unpredictability in a piece of data (such as a password), calculated in bits.'
      },
      {
        term: 'PBKDF2 (Password-Based Key Derivation Function 2)',
        category: 'Cryptography',
        definition: 'A key derivation function with a configurable work factor (iterations) and cryptographic salt designed to make brute-force password cracking computationally prohibitive.'
      },
      {
        term: 'Brute Force Attack',
        category: 'Attacks',
        definition: 'A cryptographic trial-and-error method used to decode encrypted data or guess passwords by systematically testing all possible combinations.'
      },
      {
        term: 'Phishing',
        category: 'Social Engineering',
        definition: 'A deceptive social engineering practice where attackers pose as reputable organizations or individuals in emails or messages to deceive individuals into disclosing sensitive data.'
      },
      {
        term: 'End-to-End Encryption (E2EE)',
        category: 'Cryptography',
        definition: 'A secure communication paradigm where only the communicating users can read the messages; no eavesdropper, telecom provider, or server operator can access the decryption keys.'
      },
      {
        term: 'JSON Web Token (JWT)',
        category: 'Identity',
        definition: 'An open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object signed by a secret or key pair.'
      },
      {
        term: 'Man-in-the-Middle (MitM)',
        category: 'Network',
        definition: 'An attack where the adversary secretly relays and possibly alters communications between two parties who believe they are directly communicating with each other.'
      },
      {
        term: 'Denial of Service (DoS / DDoS)',
        category: 'Attacks',
        definition: 'A cyber-attack in which the perpetrator seeks to make a machine or network resource unavailable to its intended users by overwhelming it with fake traffic.'
      },
      {
        term: 'Salting (Password Security)',
        category: 'Cryptography',
        definition: 'The addition of unique random bits to a password input before running it through a cryptographic hash function, thwarting precomputed rainbow table attacks.'
      },
      {
        term: 'Principle of Least Privilege (PoLP)',
        category: 'Architecture',
        definition: 'An information security concept that dictates a user or process must be granted only the minimal levels of access or permissions necessary to perform authorized duties.'
      }
    ];
  }

  /**
   * Educational Learning Modules
   */
  static getLearningModules() {
    return [
      {
        id: 'module_passwords',
        title: 'Mastering Password & Credential Security',
        summary: 'How modern hash algorithms work, why length trumps complexity, and how to defend against automated dictionary attacks.',
        points: [
          'Use Passphrases: 4 random words (e.g., "correct-horse-battery-staple") offer 70+ bits of entropy and are easier to remember than short mangled strings.',
          'Never reuse passwords across distinct services: Credential stuffing attacks exploit database leaks across multiple sites.',
          'Always use a verified Password Manager with audited end-to-end encryption.'
        ]
      },
      {
        id: 'module_crypto',
        title: 'Cryptography Fundamentals: Hashes vs Encryption',
        summary: 'Understanding one-way hashing algorithms (SHA-256) versus reversible symmetric/asymmetric encryption (AES / RSA).',
        points: [
          'Hashes are one-way: You cannot mathematically "decrypt" a SHA-256 hash.',
          'Collision resistance: It is computationally impossible to find two distinct inputs yielding the identical SHA-256 digest.',
          'Key Derivation Functions (Argon2, bcrypt, PBKDF2) are deliberately slow to make offline brute-forcing impractical.'
        ]
      },
      {
        id: 'module_web_sec',
        title: 'Web Application Defense (OWASP Essentials)',
        summary: 'Practical defenses against XSS, CSRF, and injection attacks for modern cloud software architectures.',
        points: [
          'Sanitize and encode all untrusted inputs before rendering them into the DOM.',
          'Use strict Content Security Policy (CSP) and modern HTTP headers (HSTS, X-Content-Type-Options).',
          'Use HttpOnly, Secure, and SameSite=Strict cookie flags for authentication tokens.'
        ]
      }
    ];
  }

  /**
   * URL Inspector & Sanitizer
   */
  static inspectUrl(urlString) {
    try {
      const url = new URL(urlString);
      const isHttps = url.protocol === 'https:';
      const params = Array.from(url.searchParams.entries()).map(([key, val]) => ({ key, val }));

      // Security checks
      const warnings = [];
      if (!isHttps) {
        warnings.push('Insecure protocol (HTTP) — data sent in plaintext without TLS encryption.');
      }
      if (url.port && !['80', '443'].includes(url.port)) {
        warnings.push(`Non-standard port (${url.port}) detected.`);
      }
      if (/@/.test(url.href.split('?')[0])) {
        warnings.push('Embedded userinfo/credentials detected in URL hostname authority.');
      }
      if (url.search.toLowerCase().includes('javascript:') || url.search.toLowerCase().includes('<script')) {
        warnings.push('Potentially malicious script payload in URL parameters.');
      }

      return {
        valid: true,
        protocol: url.protocol,
        hostname: url.hostname,
        pathname: url.pathname,
        port: url.port || (isHttps ? '443' : '80'),
        parameters: params,
        warnings,
        isSafe: warnings.length === 0
      };
    } catch (e) {
      return {
        valid: false,
        error: 'Malformed URL: ' + e.message
      };
    }
  }
}
