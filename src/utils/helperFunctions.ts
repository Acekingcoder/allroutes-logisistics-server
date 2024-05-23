import bcrypt from 'bcrypt'

export const hashedPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };