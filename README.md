# ✂️ Dijital Kuaförüm - Web Arayüzü (Frontend)

Bu proje, modern kuaför ve güzellik salonları için geliştirilmiş kapsamlı bir **Randevu ve Salon Yönetim Sisteminin** kullanıcı arayüzüdür. Müşteriler için kolay randevu alma imkanı sunarken, işletme sahipleri için detaylı bir yönetim paneli sağlar.

## 🚀 Proje Hakkında

Dijital Kuaförüm, React ve Ant Design kullanılarak geliştirilmiştir. Kullanıcı deneyimini (UX) ön planda tutan, responsive ve hızlı bir yapıya sahiptir. Sistem iki ana modülden oluşur:
1. **Müşteri Arayüzü:** Hizmetleri inceleme, takvim üzerinden müsaitlik kontrolü ve randevu oluşturma.
2. **Yönetici (Admin) Paneli:** Randevu yönetimi, müşteri takibi, hizmet/ürün düzenleme ve finansal istatistikler.

## ✨ Özellikler

### 👤 Müşteri Paneli (Public)
* **Dinamik Randevu Takvimi:** Haftalık görünümde 10'ar dakikalık slotlar halinde kuaförün müsaitliğini görüntüleme.
* **Hızlı Randevu Alma:** Hizmet seçimi ve anlık müsaitlik kontrolü ile saniyeler içinde randevu talebi.
* **Giriş/Kayıt Sistemi:** Telefon numarası (+90 formatlı) ile güvenli kayıt ve giriş.
* **Bilgilendirme Sayfaları:** Hizmetlerimiz, Fiyat Listesi, Hakkımızda ve İletişim (Google Maps entegreli).

### 🛡️ Yönetici Paneli (Admin Dashboard)
* **Gelişmiş Randevu Yönetimi:**
    * Gelen randevu taleplerini onaylama, reddetme veya iptal etme.
    * Yönetici takvimi üzerinden hızlı randevu oluşturma (Modal ile).
    * Çakışma kontrolü (Double-booking prevention).
* **Müşteri Yönetimi (CRM):**
    * Müşteri ekleme, düzenleme, silme ve geçmiş randevularını görüntüleme.
    * İsim, telefon veya e-posta ile canlı arama (Live Search).
* **Hizmet ve Ürün Yönetimi:**
    * Verilen hizmetlerin sürelerini ve fiyatlarını dinamik olarak ayarlama.
    * Salon içi ürün satışı ve stok takibi.
* **İstatistik ve Raporlama:**
    * Günlük/Aylık ciro takibi.
    * Tamamlanan ve bekleyen randevu sayıları.
    * En çok tercih edilen hizmetlerin grafiksel dağılımı (Pie Chart).

## 🛠️ Teknolojiler

* **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* **UI Kütüphanesi:** [Ant Design (Antd)](https://ant.design/)
* **HTTP İstekleri:** Axios
* **Tarih/Saat Yönetimi:** Moment.js
* **Routing:** React Router Dom v6

## 📸 Ekran Görüntüleri

*(Buraya projenin ekran görüntülerini -Ana Sayfa, Takvim, Admin Paneli- ekleyebilirsiniz)*

## ⚙️ Kurulum

Projeyi yerel ortamınızda çalıştırmak için:

1.  Repoyu klonlayın:
    ```bash
    git clone [https://github.com/kullaniciadiniz/dijital-kuaforum-ui.git](https://github.com/kullaniciadiniz/dijital-kuaforum-ui.git)
    ```
2.  Proje dizinine gidin ve bağımlılıkları yükleyin:
    ```bash
    cd dijital-kuaforum-ui
    npm install
    ```
3.  Uygulamayı başlatın:
    ```bash
    npm run dev
    ```

---
**Geliştirici:** İhsan Eren Erben
