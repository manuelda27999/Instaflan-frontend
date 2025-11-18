import Image from "next/image";

type ProfileImageProps = {
  name: string;
  image: string;
};

function ProfileImage({ name, image }: ProfileImageProps) {
  return (
    <Image
      priority
      width={120}
      height={120}
      quality={100}
      className={"w-full h-full object-cover"}
      src={image || "/images/default-profile.webp"}
      alt={`Profile image of ${name}`}
      onError={(event) => {
        const target = event.target as HTMLImageElement;
        target.src = "/images/default-profile.webp";
      }}
    />
  );
}

export default ProfileImage;
