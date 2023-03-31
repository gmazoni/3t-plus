FROM node:18
     
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends wget zsh git redis chromium jq gnupg2 nano \
    && chsh -s $(which zsh) && zsh

RUN mkdir /commandhistory \
    && touch /commandhistory/.zsh_history \
    && chown -R $USERNAME /commandhistory \
    && echo "$SNIPPET" >> "/home/$USERNAME/.zshrc"

RUN npm install -g npm pnpm

RUN echo "zsh" >> /home/$USERNAME/.bashrc

USER $USERNAME

RUN wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh \
  && cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc

RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
RUN git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
RUN git clone https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search
RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
RUN sed -i 's/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting zsh-history-substring-search)/g' ~/.zshrc
RUN sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="powerlevel10k\/powerlevel10k"/g' ~/.zshrc
RUN echo 'export GNUPGHOME=~/.gnupg\n' >> ~/.zshrc
RUN echo 'export PROMPT_COMMAND="history -a" && export HISTFILE=/commandhistory/.zsh_history\n' >> ~/.zshrc
RUN echo '[[ ! -f /.p10k.zsh ]] || source /.p10k.zsh' >> ~/.zshrc
RUN echo 'gpgconf --kill all' >> ~/.zshrc
RUN sed -i '1s/^/export GPG_TTY=$(tty)\n/' ~/.zshrc
