-- GG Pizza videoları (diğer projelerle aynı alanlar)
update public.projects
set
  galeri_1_video = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=kruv-portfolio%2Ftjuplhh3fvinklogpqi4',
  galeri_5_video = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=kruv-portfolio%2Fnit0n7q4q4u0dgbn2j2q'
where slug = 'gg-pizza';
